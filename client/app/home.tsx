import React, { } from "react";
import { Center, TitleText, TransparentCenterToolbar, VPage } from "react-native-boxes";
import { HBox, KeyboardAvoidingScrollView } from "react-native-boxes/src/Box";
import { ThumbnailItem } from "../component/ThumbnailItem";
import { useRouter } from "expo-router";

export default function HomeLayout() {

    const router = useRouter()

    return (
        <VPage>
            <TransparentCenterToolbar title="Socio Search" />
            <Center>
                <KeyboardAvoidingScrollView style={{
                    width: '100%'
                }}>

                    <HBox style={{
                        justifyContent: 'space-evenly'
                    }}>
                        <ThumbnailItem title="Linked search" icon="linkedin" onPress={() => {
                            router.navigate('search?platform=linkedin')
                        }} />
                        <ThumbnailItem title="Find Linkedin user" icon="linkedin" onPress={() => {
                            router.navigate('/linkedin')
                        }} />

                    </HBox>

                    <HBox style={{
                        justifyContent: 'space-evenly'
                    }}>
                        <ThumbnailItem title="Instagram search" icon="instagram" />
                        <ThumbnailItem title="Find Instagram user" icon="instagram" onPress={() => {
                            router.navigate('instagram')
                        }} />
                    </HBox>

                    <TitleText style={{
                        marginTop: 20,
                        textAlign: 'center'
                    }}>Recent searches</TitleText>




                </KeyboardAvoidingScrollView>
            </Center>
        </VPage>
    );
}