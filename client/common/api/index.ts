import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import { Platform } from "react-native";
import { QuerySearchArgs, User } from "../../../gen/model";
const client = new ApolloClient({
  uri: Platform.OS == "web" ? "/graph" : "https://socio.semibit.in/graph",
  cache: new InMemoryCache(),
});

export class Api {
  graph = client;

  searchUserOnInstagram(keyword: string, realFaceUrl?: string) {
    console.log("Searching for user", keyword, "on instagram");

    return this.graph
      .query({
        fetchPolicy: "cache-first",
        query: gql`
          query Search($instagram: SearchParams) {
            search(instagram: $instagram) {
              name
              subtitle
              summary
              thumbnail
              location
              igUserName
              igUserId
              igBio
              igBasic
              platform
              hdImage
              faceScore
            }
          }
        `,
        variables: {
          instagram: {
            text: keyword,
            realFaceUrl: realFaceUrl
          },
        } as QuerySearchArgs,
      })
      .then((response) => response.data.search as User[]);
  }

  linkedinFindByUsername(username: string) {
    return this.graph
      .query({
        fetchPolicy: "cache-first",
        query: gql`
          query LinkedinUser($username: String!) {
            linkedinUser(username: $username) {
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
              platform
            }
          }
        `,
        variables: {
          username,
        },
      })
      .then((response) => response.data.linkedinUser as User);
  }

  igFindByUsername(username: string) {
    return this.graph
      .query({
        fetchPolicy: "cache-first",
        query: gql`
          query InstagramUser($username: String!) {
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
              platform
            }
          }
        `,
        variables: {
          username,
        },
      })
      .then((response) => response.data.instagramUser as User);
  }
}

export function getGraphErrorMessage(error: any) {
  try {
    console.log(error);
    if (error?.networkError?.result) error = error.networkError.result;
    else if (error.message) {
      return error.message;
    }
    if (error.errors && error.errors.length > 0) {
      return error.errors
        .map((e: any) => {
          return e.message;
        })
        .join(". ");
    }
  } catch (e) {
    return "An error occurred";
  }
  return undefined;
}
