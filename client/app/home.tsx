import React, { } from "react";
import { Center, Icon, TextView, TitleText, TransparentCenterToolbar, VPage } from "react-native-boxes";
import { HBox, KeyboardAvoidingScrollView, VBox } from "react-native-boxes";
import { ThumbnailItem } from "../component/ThumbnailItem";
import { useRouter } from "expo-router";
import { Image } from 'react-native'

export default function HomeLayout() {

    const router = useRouter()

    return (
        <VPage>
            <TransparentCenterToolbar title="Socio Search" />


            <Center style={{
                paddingTop: 100
            }}>
                <Image source={require('../assets/icon.jpeg')}

                    style={{
                        borderRadius: 10,
                        height: 220,
                        width: 220
                    }} />
                <TextView style={{
                    padding: 20,
                    textAlign: 'center'
                }}>Socio is a platform where you can find users on different social media websites starting with any one</TextView>

            </Center>
            <Center style={{
                width: '100%',
                position: 'absolute',
                bottom: 0,
                paddingBottom: 50
            }}>
                <ThumbnailItem title="Find by linkedin id" icon="linkedin" onPress={() => {
                    router.navigate('/linkedin')
                }} />
                <ThumbnailItem title="Find by instagram id" icon="instagram" onPress={() => {
                    router.navigate('instagram')
                }} />
            </Center>

        </VPage>
    );
}