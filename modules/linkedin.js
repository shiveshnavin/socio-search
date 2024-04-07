const fs = require('fs')
const path = require('path')
const json = require('jsonpath')
const axios = require('axios')
// let str = fs.readFileSync(path.join(__dirname, 'test.json')).toString()
// let obj = JSON.parse(str)

function mapLinkedinEducation(edu) {
    let years = json.value(edu, '$.components.entityComponent.caption.text')?.split('-') || []
    return {
        name: json.value(edu, '$.components.entityComponent.titleV2.text.text'),
        course: json.value(edu, '$.components.entityComponent.subtitle.text'),
        yearFrom: years[0]?.trim(),
        yearTo: years[1]?.trim(),
        link: json.value(edu, '$.components.entityComponent.textActionTarget')
    }
}

function mapGetUser(username, obj) {
    let profileObj = json.value(obj, `$.included[?(@.publicIdentifier == "${username.trim()}")]`)
    let ops =
    {
        name: json.value(profileObj, '$.firstName') + " " + json.value(profileObj, '$.lastName'),
        subtitle: json.value(profileObj, '$.headline'),
        summary: json.value(profileObj, '$.headline'),
        location: json.value(profileObj, '$.headline'),
        linkedinDegree: json.value(obj, `$.included[?(@.schoolName)].schoolName`),
        linkedinUrl: `https://www.linkedin.com/in/${json.value(profileObj, '$.publicIdentifier')}`,
        linkedinId: profileObj?.entityUrn.replace("urn:li:fsd_entityResultViewModel:(", "").replace(",SEARCH_SRP,DEFAULT)", "")
    }
    return ops
}
function mapSearchRespToUser(obj) {

    let users = json.query(obj, '$.included[?(@.title)]')
    let ops = users.map(obj => {
        return {
            name: json.value(obj, '$.title.text'),
            subtitle: json.value(obj, '$.primarySubtitle.text'),
            summary: json.value(obj, '$.summary.text'),
            image: json.value(obj, '$.image.attributes[0].detailData.nonEntityProfilePicture.vectorImage.artifacts.0.fileIdentifyingUrlPathSegment'),
            location: json.value(obj, '$.secondarySubtitle.text'),
            linkedinDegree: json.value(obj, '$.badgeText.text')?.trim(),
            linkedinUrl: json.value(obj, '$.navigationUrl')?.split("?")[0],
            linkedinId: obj?.entityUrn.replace("urn:li:fsd_entityResultViewModel:(", "").replace(",SEARCH_SRP,DEFAULT)", "")
        }
    })
    return ops
}
// fs.writeFileSync('op.json', JSON.stringify(ops, undefined, 2))
let bots = `http://bots.semibit.in/semibit-media/generic?bot_name=linkedin-scrper`

async function post(liUrl, url, baseUrl) {
    let resp = await axios.post(baseUrl || bots, {
        "params": {
            "url": url || "https://www.linkedin.com/search",
            "api_url": liUrl
        }
    })
    let body = typeof resp.data == 'string' ?
        JSON.parse(resp.data) : resp.data
    let data = body
    return data
}
module.exports = {
    linkedinUser: async function (userName) {
        let url = `https://www.linkedin.com/voyager/api/graphql?variables=(vanityName:${userName})&queryId=voyagerIdentityDashProfiles.e8511bf881819fb8156472959c87f423`
        data = await post(url)
        let urn = json.value(data, '$.data.data.identityDashProfilesByMemberIdentity')["*elements"][0]
        let user = mapGetUser(userName, data)

        const { image_url } = await post(undefined, `https://www.linkedin.com/in/${userName}/overlay/photo/`, 'https://bots.semibit.in/semibit-media/generic?bot_name=linkedin-single')
        user.image = image_url
        user.linkedinId = urn

        url = `https://www.linkedin.com/voyager/api/graphql?variables=(profileUrn:${encodeURIComponent('urn:li:fsd_profile:ACoAABrEx5MB_RLV_JOsJIlnhoWVhzKyjZzwfMg'
        )},sectionType:education,locale:en_US)&queryId=voyagerIdentityDashProfileComponents.8d25f7518e7c0cf5b0ccac7a8a24284a`

        data = await post(url)
        let educationsRaw = json.value(data, '$.included[*].components.elements')
        let educations = educationsRaw?.map(mapLinkedinEducation)
        let dt = {
            ...user,
            linkedinEducation: educations
        }
        return dt
    },
    search: function (text, city) {
        let LOCATIONS = {
            'delhi': '105282602,115918471,106187582',
            'bengaluru': '90009633,105214831',
            'india': '102713980'
        }
        let location = LOCATIONS[city] || city || '102713980';
        let url = `https://www.linkedin.com/voyager/api/graphql?variables=(start:0,origin:FACETED_SEARCH,query:(keywords:${encodeURIComponent(text)},flagshipSearchIntent:SEARCH_SRP,queryParameters:List((key:geoUrn,value:List(${location})),(key:network,value:List(F)),(key:resultType,value:List(PEOPLE))),includeFiltersInResponse:false))&queryId=voyagerSearchDashClusters.14bfbc3ae7fe6444020271ee652fadae`
        return post(url).then(mapSearchRespToUser)
    }
}