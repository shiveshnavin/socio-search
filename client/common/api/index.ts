import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { Platform } from 'react-native';
import { User } from '../../../gen/model';
const client = new ApolloClient({
    uri: Platform.OS == 'web' ? '/graph' : 'http://192.168.1.8:3000/graph',
    cache: new InMemoryCache(),
});

export class Api {
    graph = client

    igFindByUsername(username: string) {
        return this.graph.query({
            query: gql`query InstagramUser($username: String!) {
                instagramUser(username: $username) {
                    name
                    subtitle
                    summary
                    image
                    hdImage
                    thumbnail
                    location
                    igUserName
                    igUserId
                    igBio
                    igBasic
                }
              }`,
            variables: {
                username
            }
        }).then(response => response.data.instagramUser as User)
    }
}


export function getGraphErrorMessage(error: any) {
    try {
        console.log(error)
        if (error?.networkError?.result)
            error = error.networkError.result
        else if (error.message) {
            return error.message
        }
        if (error.errors && error.errors.length > 0) {
            return error.errors.map((e: any) => {
                return e.message
            }).join(". ")
        }
    } catch (e) {
        return "An error occurred"
    }
    return undefined
}
