import { Redirect } from 'expo-router';
import { useApp } from '../context/AppContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { user } = useApp();

  if (user === null) {
    return <Redirect href="/(auth)/sign-in" />;
  } else if (user.role === 'admin') {
    return <Redirect href="/(admin)/dashboard" />;
  } else {
    return <Redirect href="/(volunteer)/home" />;
  }
}
