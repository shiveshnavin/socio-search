import { useLocalSearchParams } from "expo-router";
import { useRouteInfo, useRouter } from "expo-router/build/hooks";
import React, { useEffect } from "react";
import { useContext } from "react";
import { Center, TextView, ThemeContext, VPage } from "react-native-boxes";


export default function QueryPage() {
    const theme = useContext(ThemeContext)
    const { user, query } = useLocalSearchParams();
    return (
        <VPage>
            <Center>
                <TextView>Hello {user}!</TextView>
                <TextView>{query}</TextView>
            </Center>
        </VPage>
    );
}