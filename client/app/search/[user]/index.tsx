import { AppContext } from "@/components/Context";
import { gql } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import { useRouteInfo, useRouter } from "expo-router/build/hooks";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Center, TextView, ThemeContext, Title, VPage } from "react-native-boxes";
import { User } from "../../../../gen/model";


export default function QueryPage() {
    const theme = useContext(ThemeContext)
    const { user } = useLocalSearchParams();
    const [curUser, setCurUser] = useState<User>({})
    const appContext = useContext(AppContext)
    const graph = appContext.context.api.graph
    useEffect(() => {
        let query = `
        query GetUser {
            user: User(id:"${user}") {
                id
                first_name
                userName
            }
        }
   `
        graph.query({
            query: gql(query),
        }).then((result: any) => {
            setCurUser(result.data.user)
        });
    }, [])


    return (
        <VPage>
            <Center>
                <TextView>Hello {user}!</TextView>
                <Title>{curUser.userName}</Title>
            </Center>
        </VPage>
    );
}