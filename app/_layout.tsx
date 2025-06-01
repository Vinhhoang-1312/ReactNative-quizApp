import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/Roboto_Condensed-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;  }

  return (
    
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
