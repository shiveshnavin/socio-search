import React, { useState, useContext, useEffect } from "react";
import { Theme, ThemeContext, Colors, TextView } from "react-native-boxes";
import { loadAsync } from "expo-font";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AppContext, ContextData } from "../components/Context";
import { Linking } from "react-native";
import { Stack, router, useRouter } from 'expo-router';
import { Slot } from 'expo-router';
import { BottomNavBar, SimpleToolbar, VBox, VPage } from 'react-native-boxes';
import { useRouteInfo } from "expo-router/build/hooks";


function Main() {
  const [context, setContext] = useState(new ContextData())
  const basePath = '/ui/'
  context.appname = 'client'
  const theme = new Theme('client', Object.assign(Colors, {
    background: '#F5F5F5'
  }))
  theme.insets = useSafeAreaInsets()
  const [init, setInit] = useState(false)
  loadAsync({
    'Regular': require('../assets/fonts/Regular.ttf'),
    'Bold': require('../assets/fonts/Bold.ttf'),
    'Styled': require('../assets/fonts/Bold.ttf'),
  }).finally(() => {
    setTimeout(() => {
      setInit(true)
    }, 500)
  })

  Linking.addEventListener('url', (url) => {
    if (url?.url) {
      let path = url?.url.split("://")[1]
      if (path)
        router.navigate(path)
    }
  });
  const router = useRouter()
  const [bottombarHeight, setBottomBarHeight] = useState(100)
  const [bottombarId, setBottombarId] = useState('/')
  const route = useRouteInfo()
  useEffect(() => {
    console.log('route', route)
    let id = route.pathname.split('/')[1]
    setBottombarId(id)
    setTimeout(() => {
      router.navigate(route.unstable_globalHref)
    }, 1000)
  }, [])
  return (
    <ThemeContext.Provider value={theme} >
      <AppContext.Provider value={{ context, setContext }}>
        <SafeAreaView style={{
          width: '100%',
          height: '100%'
        }}>
          <VPage>
            <VBox style={{
              margin: 0,
              padding: 0,
              marginBottom: bottombarHeight
            }}>
              <Stack />
            </VBox>
            <BottomNavBar
              onDimens={(w, h) => {
                setBottomBarHeight(h)
              }}
              selectedId={bottombarId}
              onSelect={(id) => {
                router.navigate(basePath + id)
                setBottombarId(id)
              }}
              options={[{
                id: 'home',
                icon: 'home',
                title: 'Home'
              },
              {
                id: 'search',
                icon: 'search',
                title: 'Search'
              },
              {
                id: 'profile',
                icon: 'user',
                title: 'Profile'
              }]} />
          </VPage>
        </SafeAreaView>
      </AppContext.Provider>
    </ThemeContext.Provider >
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Main />
    </SafeAreaProvider>
  )
}