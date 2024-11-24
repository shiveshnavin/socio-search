import { AppContext } from "@/components/Context";
import { gql } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Avatar, Center, PressableView, Subtitle, TextView, ThemeContext, VBox, VPage } from "react-native-boxes";
import { User } from '../../gen/model'
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { HBox, KeyboardAvoidingScrollView } from "react-native-boxes/src/Box";

export default function HomeLayout() {
    const theme = useContext(ThemeContext)
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
                "username": "deveshk1"
            }
        }).then((result: any) => {
            setUsers(result.data.users)
        });
    }, [])
    return (
        <VPage>
            <Center>
                <TextView>Hello World!</TextView>
                <KeyboardAvoidingScrollView style={{
                    width: '100%'
                }}>


                </KeyboardAvoidingScrollView>
            </Center>
        </VPage>
    );
}