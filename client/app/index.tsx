import React from "react";
import { useContext } from "react";
import { Center, TextView, ThemeContext, VPage } from "react-native-boxes";


export default function HomeLayout() {
    const theme = useContext(ThemeContext)
    return (
        <VPage>
            <Center>
                <TextView>Hello World!</TextView>
            </Center>
        </VPage>
    );
}