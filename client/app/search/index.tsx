import { useLocalSearchParams } from "expo-router";
import React, { useContext } from "react";
import { ButtonView, CompositeTextInputView, TransparentCenterToolbar, VPage } from "react-native-boxes";
import { AppContext } from "../../components/Context";
import { gql } from "@apollo/client";


export default function Search() {

    const { api } = useContext(AppContext).context
    const { platform } = useLocalSearchParams()

    api.graph.query({
        query: gql`
            
        
        `,
        variables: {

        }
    })

    return (
        <VPage style={{
            padding: 10
        }}>
            <TransparentCenterToolbar title={"Search " + platform} />
            <CompositeTextInputView placeholder="Enter keyword" />
            <ButtonView text="Search" onPress={() => {

            }} />
        </VPage>
    )
}