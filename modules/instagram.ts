import { User } from "../gen/model"

const axios = require('axios')

function mapIGToUser(igu) {
    return {
        name: igu.full_name != "" ? igu.full_name : igu.username,
        summary: igu.biography,
        subtitle: igu.biography,
        hdImage: igu.hd_profile_pic_url_info?.url || igu.profile_pic_url_hd,
        igBio: igu.biography,
        image: igu.hd_profile_pic_url_info?.url || igu.profile_pic_url,
        thumbnail: igu.hd_profile_pic_url_info?.url || igu.profile_pic_url,
        igUserName: igu.username,
        igUserId: igu.pk,
        igBasic: `private=${igu.is_private != undefined ? igu.is_private : '-'}, media=${igu.media_count || '-'}, following=${igu.following_count || '-'}, follower=${igu.follower_count || '-'}`
    } as User
}

const Instagram = {
    async search(search) {
        let url = `http://oci.semibit.in:4040/semibit-media/instagram-bot/searchUser?username=${encodeURIComponent(search)}&force=1`
        let response = await axios.get(url).then(rep => rep.data.map(mapIGToUser))
        return response
    },
    async getUser(username, cachedUser?) {
        if (cachedUser?.image) {
            return cachedUser
        }
        let url = `http://oci.semibit.in:4040/semibit-media/instagram-bot/getUser?username=${encodeURIComponent(username)}&force=1`
        let response = await axios.get(url).then(rep => (mapIGToUser(rep.data)))
        return response
    },
    async getUsersInBatch(usernames): Promise<User[]> {
        let url = `http://oci.semibit.in:4040/semibit-media/instagram-bot/getUser?usernames=${encodeURIComponent(usernames)}&force=1`
        let response = await axios.get(url).then(rep => rep.data.map(ud => ud.user).map(mapIGToUser))
        return response
    }
}

export default Instagram