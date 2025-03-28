import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '@/i18n';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthContextProvider, useAuth } from '../context/authContext'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    const segment = useSegments();
    const router = useRouter();

    useEffect(() => {
      // check user authenticated or not
      if (typeof isAuthenticated == 'undefined') return;
      const inApp = segment[0] == '(app)';

      if (isAuthenticated && !inApp) {
        // redirect to home
        router.replace('/ChatList');
      } else {
        // redirect to signup
        router.replace('/Login');
      }
    }, [isAuthenticated])
  }

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthContextProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="Login/index" options={{ headerShown: false }} />
          <Stack.Screen name="Signup/index" options={{ headerShown: false }} />
          <Stack.Screen name="ChaLlist/index" options={{ headerShown: false }} />
          <Stack.Screen name="ChatRoom/index" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthContextProvider>
  );
}
