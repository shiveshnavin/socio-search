import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { User } from '../../gen/model'
import { FlatList, Platform, Pressable } from 'react-native'
import { AlertMessage, ButtonView, Caption, CardView, Center, HBox, Icon, RightIconButton, Spinner, Subtitle, TextView, ThemeContext, TitleText, VBox } from "react-native-boxes";
import { Image } from "react-native";
import * as Linking from 'expo-linking';
import { AppContext } from "../components/Context";
import { Api, getGraphErrorMessage } from "../common/api";
import { router } from "expo-router";

export function UserNetwork(props: { user: User, targetPlatform: string }) {
    const user = props.user
    console.log('Loaded user', user)
    const [users, setUsers] = useState<User[] | null | undefined>(undefined)
    const [error, setError] = useState<string | undefined>(undefined)
    const api = useContext(AppContext).context.api
    const [index, setIndex] = useState(0)

    const onViewableItemsChanged = ({
        viewableItems,
    }: any) => {
        let idx = viewableItems[0]?.index || 0
        console.log('scroleld to ', idx)
        setIndex(idx)
    };
    const viewabilityConfigCallbackPairs = useRef([
        { onViewableItemsChanged },
    ]);

    const theme = useContext(ThemeContext)
    function findUser(username: string, targetPlatform: string, realFaceUrl?: string) {
        if (targetPlatform == 'instagram') {
            setUsers(null)
            api.searchUserOnInstagram(username, realFaceUrl)
                .then(u => {
                    return u.sort((b, a) => {
                        return (a.faceScore || 0) - (b.faceScore || 0)
                    })
                })
                .then(setUsers)
                .catch(e => {
                    setUsers(undefined)
                    setError(getGraphErrorMessage(e))
                })
        }
    }

    const flatListRef = useRef(FlatList);
    const nextPress = () => {
        console.log('nextpress', index)
        if (index <= (users?.length as number - 2)) {
            //@ts-ignore
            flatListRef?.current?.scrollToIndex({
                animated: true,
                index: index + 1
            });
            setIndex((ix) => {
                return ix + 1
            })
        }
    };
    const backPress = () => {
        console.log('backPress', index)

        if (index >= 1) {
            //@ts-ignore
            flatListRef?.current?.scrollToIndex({
                animated: true,
                index: index - 1
            });

            setIndex((ix) => {
                return ix - 1
            })
        }
    };
    const [collapsed, setCollapsed] = useState(false)

    return (
        <VBox style={{
            height: '100%'
        }}>

            {
                user && (
                    <VBox style={{
                        paddingLeft: theme.dimens.space.lg,
                        paddingRight: theme.dimens.space.lg
                    }}>
                        <UserCard
                            user={user}
                            api={api}
                            collapsable={true}
                            collapsed={collapsed}
                            onCollapseClick={(show) => {
                                setCollapsed(c => !c)
                            }} />
                    </VBox>
                )
            }
            {
                error && (
                    <AlertMessage text={error} type="critical" />
                )
            }


            {
                users === null && <Spinner size={40} />
            }
            {
                //@ts-ignore
                <FlatList
                    viewabilityConfigCallbackPairs={
                        viewabilityConfigCallbackPairs.current
                    }
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 50
                    }}
                    ref={flatListRef}

                    keyExtractor={(i) => "" + i.igUserId}
                    renderItem={(item: any) => {
                        // console.log('rendering', item.item)
                        return (
                            <CardView>
                                <UserCard
                                    api={api}
                                    collapsed={collapsed}
                                    user={item.item}
                                    //@ts-ignore
                                    platform={user.igUserId ? 'instagram' : 'linkedin'} />
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
                        zIndex: 1000,
                        padding: theme.dimens.space.lg,
                        marginBottom: 50
                    }}
                    onPress={() => {
                        if (user && user.name) {
                            findUser(user.name, props.targetPlatform, user.image as string)
                        }
                    }} />
            }


            {
                users !== undefined &&

                <HBox style={{
                    backgroundColor: 'transparent',
                    position: 'fixed',
                    bottom: 50,
                    left: 0,
                    width: '100%',
                    justifyContent: 'space-between'
                } as any}>
                    <ButtonView text="Next" icon="arrow-left" onPress={backPress} />
                    <RightIconButton text="Prev" icon="arrow-right" onPress={nextPress} />
                </HBox>
            }
        </VBox>
    )
}

export function UserCard(props: {
    user: User,
    api: Api,
    onCollapseClick?: (show: boolean) => void, collapsed?: boolean, collapsable?: boolean
}) {
    const [fullyLoaded, setFullyLoaded] = useState(false)
    const [user, setUser] = useState(props.user)
    useEffect(() => {
        setUser(props.user)
    }, [props.user])
    const [loading, setLoading] = useState(false)
    const platform = user.platform
    const theme = useContext(ThemeContext)
    const [collapsed, setCollapsed] = useState(props.collapsed)
    useEffect(() => {
        if (props.collapsed != undefined)
            setCollapsed(props.collapsed)
    }, [props.collapsed])
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

    const openExternal = () => {
        console.log("Linking", platform, user?.igUserName || user?.linkedinUserName)
        if (platform == 'instagram' && user?.igUserName) {
            Linking.openURL(`https://www.instagram.com/${user?.igUserName}`)
        } else if (platform == 'linkedin' && user?.linkedinUserName) {
            Linking.openURL(`https://www.linkedin.com/in/${user?.linkedinUserName}`)
        }
    }

    function loadFull() {
        if (platform == 'instagram') {
            setLoading(true)
            props.api?.igFindByUsername(user.igUserName as string)
                .then((user) => {
                    setUser(user)
                    setFullyLoaded(true)
                })
                .catch(e => {
                    console.warn(e)
                })
                .finally(() => {
                    setLoading(false)
                })

        }
    }
    return (
        <VBox>

            <HBox style={{
                alignItems: 'center',
                justifyContent: 'space-between'

            }}>
                <Pressable onPress={openExternal}>
                    <TitleText style={{
                        paddingTop: 15,
                        color: theme.colors.accent
                    }}>{user.name}{user?.faceScore !== undefined ? ` (face score = ${user.faceScore})` : ''}</TitleText>
                </Pressable>
                {
                    loading && (
                        <Spinner size={"small"} />
                    )
                }
                {
                    props.collapsable && (
                        <Icon name={!collapsed ? "eye" : "eye-slash"} onPress={() => {
                            if (props.onCollapseClick) {
                                props.onCollapseClick(!collapsed)
                                return
                            }
                            setCollapsed((v) => {
                                return !v
                            })
                        }} />
                    )
                }


            </HBox>
            {
                (!collapsed || fullyLoaded) && (
                    <>
                        <TextView>{user.igUserName || user.name} : {user.igBasic || user.subtitle}</TextView>
                        <Caption>{user.igBio || user.summary}</Caption>
                    </>
                )
            }

            <Pressable onPress={loadFull}>

                {
                    Platform.OS == 'web' && platform == 'instagram'
                        ?
                        (
                            <iframe
                                src={(user.hdImage || user.image || user.thumbnail) as string}
                                style={{
                                    border: 'none',
                                    width: '100%',
                                    borderRadius: 10,
                                    height: 'auto',
                                    overflow: 'hidden',
                                }}
                            />
                        )
                        :
                        (
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
                        )
                }
            </Pressable>

        </VBox>
    )
}