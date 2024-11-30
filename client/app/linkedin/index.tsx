import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ButtonView, CompositeTextInputView, TransparentCenterToolbar, VBox, VPage } from "react-native-boxes";


export default function Instagram() {
    const [username, setUserName] = useState("")
    const router = useRouter()

    const start = useCallback(() => {
        let _username = username
        if (_username?.indexOf("linkedin") > -1) {
            _username = _username.split("/")[4]
        }
        router.navigate(`linkedin/${_username?.toLocaleLowerCase()}`)
    }, [])


    return (
        <VPage style={{
            padding: 10,
        }}>
            <TransparentCenterToolbar title={"Find Instagram user"} />

            <CompositeTextInputView
                returnKeyType="done"
                onDone={start}
                style={{
                    margin: 10
                }}
                onIconPress={start}
                icon="search"
                placeholder="Enter username" onChangeText={setUserName} />
            <ButtonView text="Search" onPress={start} style={{
                width: '100%',
                position: 'absolute',
                bottom: 10,
                left: 5,
                right: 0,
            }} />

        </VPage>
    )
}