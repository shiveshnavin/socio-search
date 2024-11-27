import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ButtonView, CompositeTextInputView, Spinner, TransparentCenterToolbar, VPage } from "react-native-boxes";
import { AppContext } from "../../components/Context";
import { gql } from "@apollo/client";
import { User } from "../../../gen/model";
import { UserNetwork } from "../../component/UserNetwork";
import { getGraphErrorMessage } from "../../common/api";


export default function Instagram() {
    const [username, setUserName] = useState("")
    const router = useRouter()
  
    useEffect(() => {

    }, [])

    return (
        <VPage style={{
            padding: 10
        }}>
            <TransparentCenterToolbar title={"Find Instagram user"} />
            <CompositeTextInputView
                style={{
                    margin: 10
                }}
                onIconPress={() => {
                    let _username = username
                    if(_username?.indexOf("linkedin")){
                        _username = _username.split("/")[4]
                    }
                    router.navigate(`linkedin/${_username}`)
                }}
                icon="search"
                placeholder="Enter username" onChangeText={setUserName} />

        </VPage>
    )
}