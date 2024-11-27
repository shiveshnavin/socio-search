import React, { useContext, useEffect, useState } from "react";
import { VPage } from "react-native-boxes";
import { AppContext } from "../../../components/Context";
import { gql } from "@apollo/client";

export default function InstagramUser() {
    const appContext = useContext(AppContext)
    const graph = appContext.context.api.graph
    const [users, setUsers] = useState([])
    useEffect(() => {
        let query = `
        query Search( $username: String!) {

            instagramUser(username: $username) {
                name
                subtitle
                summary
                image
                thumbnail
                location
                igUserName
                igUserId
                igBio
                igBasic
            }
         }
     `
        graph.query({
            query: gql(query),
            variables: {
                "username": "username"
            }
        }).then((result: any) => {
            setUsers(result.data.users)
        });
    }, [])
    return (
        <VPage>

        </VPage>
    )
}