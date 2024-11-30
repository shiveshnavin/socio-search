import React from "react";
import { ImageBackground, PressableProps } from "react-native";
import { CardView, Center, Icon, PressableView, TextView } from "react-native-boxes";

export function ThumbnailItem(props: { title: string, icon: string } & PressableProps) {
    return (
        <PressableView {...props} style={{
            width: '100%',
        }}>
            <CardView style={{
                height: 80
            }}>
                <Center>
                    <Icon name={props.icon} />
                    <TextView style={{
                        textAlign: 'center'
                    }}>{props.title}</TextView>
                </Center>
            </CardView>
        </PressableView>
    )
}