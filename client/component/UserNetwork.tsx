import React, { useContext, useState } from "react";
import { User } from '../../gen/model'
import { FlatList, Pressable } from 'react-native'
import { AlertMessage, ButtonView, Caption, CardView, Center, Icon, Spinner, Subtitle, TextView, ThemeContext, TitleText, VBox } from "react-native-boxes";
import { Image } from "react-native";
import * as Linking from 'expo-linking';
import { AppContext } from "../components/Context";
import { getGraphErrorMessage } from "../common/api";

export function UserNetwork(props: { user: User, targetPlatform: string }) {
    const user = props.user
    console.log('Loaded user', user)
    const [users, setUsers] = useState<User[] | null | undefined>(undefined)
    const [error, setError] = useState<string | undefined>(undefined)
    const api = useContext(AppContext).context.api
    const theme = useContext(ThemeContext)
    function findUser(username: string, targetPlatform: string) {
        if (targetPlatform == 'instagram') {
            setUsers(null)
            api.searchUserOnInstagram(username)
                .then(setUsers)
                .catch(e => {
                    setUsers(undefined)
                    setError(getGraphErrorMessage(e))
                })
        }
    }

    return (
        <VBox>
            {
                error && (
                    <AlertMessage text={error} type="critical" />
                )
            }

            {
                user && (
                    <VBox style={{
                        padding: theme.dimens.space.lg
                    }}>
                        <UserCard user={user} />
                    </VBox>
                )
            }

            {
                users === null && <Spinner size={40} />
            }
            {
                <FlatList
                    style={{
                        marginBottom: 50
                    }}
                    keyExtractor={(i) => "" + i.igUserId}
                    renderItem={(item: any) => {
                        console.log('rendering', item.item)
                        return (
                            <CardView>
                                <UserCard user={item.item} />
                            </CardView>
                        )
                    }} data={users || []} />
            }
            {
                users?.length == 0 && (
                    <Center style={{
                        padding: 20
                    }}>
                        <Icon name="users" size={100} color={theme.colors.caption} />
                        <TextView style={{
                            padding: 20
                        }}>No matching users found</TextView>
                    </Center>
                )
            }
            {
                users === undefined && <ButtonView text="Begin search"
                    style={{
                        padding: theme.dimens.space.lg
                    }}
                    onPress={() => {
                        if (user && user.name) {
                            findUser(user.name, props.targetPlatform)
                        }
                    }} />
            }
        </VBox>
    )
}

export function UserCard({ user, platform }: { user: User, platform?: string }) {
    const theme = useContext(ThemeContext)
    if (!user) {
        return (
            <Center style={{
                padding: 20
            }}>
                <Icon name="users" size={100} color={theme.colors.caption} />
                <TextView style={{
                    padding: 20
                }}>Unable to load user</TextView>
            </Center>
        )
    }
    return (
        <VBox>

            <Pressable onPress={() => {
                console.log("Linking", user?.igUserName || user?.linkedinUserName)
                if (platform == 'instagram') {
                    Linking.openURL(`https://www.instagram.com/${user?.igUserName}`)
                } else if (platform == 'linkedin') {
                    Linking.openURL(`https://www.linkedin.com/in/${user?.linkedinUserName}`)
                }
            }}>
                <TitleText style={{
                    paddingTop: 15,
                    color: theme.colors.accent
                }}>{user.name}</TitleText>
            </Pressable>
            <TextView>{user.igUserName || user.name} : {user.igBasic || user.subtitle}</TextView>
            <Caption>{user.igBio || user.summary}</Caption>
            <Image
                style={{

                    minHeight: 250,
                    width: '100%',
                    borderRadius: 10
                }}
                source={{
                    // uri: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f'
                    uri: (user.hdImage || user.image || user.thumbnail) as string
                }} />
        </VBox>
    )
}