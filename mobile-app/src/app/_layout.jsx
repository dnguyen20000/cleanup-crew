import { Stack } from 'expo-router';
import { AppProvider } from '../context/AppContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </AppProvider>
    </SafeAreaProvider>
  );
}
