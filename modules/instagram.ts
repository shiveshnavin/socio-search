const axios = require('axios')

function mapIGToUser(igu) {
    return {
        name: igu.full_name != "" ? igu.full_name : igu.username,
        summary: igu.biography,
        subtitle: igu.biography,
        igBio: igu.biography,
        image: igu.hd_profile_pic_url_info?.url || igu.profile_pic_url,
        thumbnail: igu.hd_profile_pic_url_info?.url || igu.profile_pic_url,
        igUserName: igu.username,
        igUserId: igu.pk,
        igBasic: `private=${igu.is_private != undefined ? igu.is_private : '-'}, media=${igu.media_count || '-'}, following=${igu.following_count || '-'}, follower=${igu.follower_count || '-'}`
    }
}

const Instagram = {
    search(search) {
        let url = `http://oci.semibit.in:4040/semibit-media/instagram-bot/searchUser?username=${encodeURIComponent(search)}&force=1`
        return axios.get(url).then(rep => rep.data.map(mapIGToUser))
    },
    async getUser(username, cachedUser?) {
        if (cachedUser?.summary) {
            return cachedUser
        }
        let url = `http://oci.semibit.in:4040/semibit-media/instagram-bot/getUser?username=${encodeURIComponent(username)}`
        return axios.get(url).then(rep => (mapIGToUser(rep.data)))
    }
}

export default Instagram