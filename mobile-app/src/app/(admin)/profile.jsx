import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, ShieldCheck, Mail } from 'lucide-react-native';
import Header from '../../components/Header';
import { useApp } from '../../context/AppContext';
import { COLORS, globalStyles } from '../../theme';

export default function AdminProfile() {
  const { user, signOut } = useApp();
  const router = useRouter();

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={globalStyles.container}>
      <Header title="Profile" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={globalStyles.screen}>
        
        <View style={[globalStyles.card, { alignItems: 'center', paddingTop: 24 }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={[globalStyles.boldText, { fontSize: 22, marginBottom: 8 }]}>{user.name}</Text>
          <View style={[globalStyles.pill, globalStyles.pillBlue]}>
            <ShieldCheck size={14} color="#8fb3ff" />
            <Text style={[globalStyles.pillText, globalStyles.pillTextBlue]}>Event Admin</Text>
          </View>
        </View>

        <View style={globalStyles.card}>
          <View style={[styles.listRow, { paddingTop: 0 }]}>
            <View style={globalStyles.row}>
              <Mail size={18} color={COLORS.textDim} />
              <Text style={globalStyles.mutedText}>Email</Text>
            </View>
            <Text style={[globalStyles.boldText, { fontSize: 14 }]}>{user.email}</Text>
          </View>
          
          <View style={styles.divider} />

          <View style={[styles.listRow, { paddingBottom: 0 }]}>
            <View style={globalStyles.row}>
              <ShieldCheck size={18} color={COLORS.textDim} />
              <Text style={globalStyles.mutedText}>Role</Text>
            </View>
            <Text style={[globalStyles.boldText, { fontSize: 14 }]}>Admin · Event host</Text>
          </View>
        </View>

        <View style={globalStyles.card}>
          <Text style={[globalStyles.mutedText, { fontSize: 13, lineHeight: 20 }]}>
            As an admin, every event you create is time/date-boxed and manned by you —
            volunteers can only check in during the scheduled window, and hours are only
            awarded after you verify the before/after photos.
          </Text>
        </View>

        <TouchableOpacity
          style={[globalStyles.btn, globalStyles.btnOutline, { marginTop: 8 }]}
          onPress={() => {
            signOut();
            router.replace('/(auth)/sign-in');
          }}
        >
          <LogOut size={18} color={COLORS.text} />
          <Text style={globalStyles.btnText}>Log out</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  }
});
