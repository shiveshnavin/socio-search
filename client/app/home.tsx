import { AppContext } from "@/components/Context";
import { gql } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Avatar, Center, PressableView, Subtitle, TextView, ThemeContext, VBox, VPage } from "react-native-boxes";
import { User } from '../../gen/model'
import { router } from "expo-router";
import { ScrollView } from "react-native";
import KeyboardAvoidingScrollView, { HBox } from "react-native-boxes/src/Box";

export default function HomeLayout() {
    const theme = useContext(ThemeContext)
    const appContext = useContext(AppContext)
    const graph = appContext.context.api.graph
    const [users, setUsers] = useState([])
    useEffect(() => {
        let query = `
        query GetUsers {
            users {
                id
                first_name
                userName

            }
        }
     `
        graph.query({
            query: gql(query),
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
                    {
                        users.map((u: User) => {
                            return (
                                <PressableView
                                    key={u.id}
                                    onPress={() => {
                                        router.navigate(`/search/${u.id}`)
                                    }}
                                    style={{
                                        width: '100%'
                                    }}>
                                    <VBox style={{
                                        margin: theme.dimens.space.md,
                                        width: '98%',
                                        padding: theme.dimens.space.md,
                                        backgroundColor: theme.colors.forground,
                                        borderRadius: theme.dimens.space.md
                                    }}>
                                        <HBox style={{
                                            alignItems: 'center'
                                        }}>
                                            <Avatar iconText={u.first_name?.substring(0, 2).toUpperCase()} />
                                            <VBox>
                                                <Subtitle style={{
                                                    fontFamily: theme.fonts.Bold
                                                }}>{u.userName}</Subtitle>
                                                <TextView>{u.first_name}</TextView>
                                            </VBox>
                                        </HBox>
                                    </VBox>
                                </PressableView>
                            )
                        })
                    }
                </KeyboardAvoidingScrollView>
            </Center>
        </VPage>
    );
}