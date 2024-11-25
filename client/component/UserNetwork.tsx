import React from "react";
import { User } from '../../gen/model'
import { ButtonView, Caption, CardView, Subtitle, TextView, TitleText, VBox } from "react-native-boxes";
import { Image } from "react-native";

export function UserNetwork(props: { user: User }) {
    const user = props.user
    return (
        <VBox>
            <CardView>
                <VBox>
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
                    <TitleText style={{
                        paddingTop: 15
                    }}>{user.name}</TitleText>
                    <TextView>{user.igUserName || user.name} : {user.igBasic || user.subtitle}</TextView>
                    <Caption>{user.igBio || user.summary}</Caption>
                </VBox>
            </CardView>

            <CardView>
                <ButtonView text="Begin search" />
            </CardView>
        </VBox>
    )
}