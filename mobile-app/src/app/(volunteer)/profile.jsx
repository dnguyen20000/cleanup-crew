import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Download, MapPin, Mail, Users, LogOut, Award, ShieldCheck } from 'lucide-react-native';
import Header from '../../components/Header';
import { useApp } from '../../context/AppContext';
import { rankFor } from '../../data/mockData';
import { downloadCertificate } from '../../utils/cert';
import { COLORS, SIZES, globalStyles } from '../../theme';

export default function Profile() {
  const { user, signOut, signups, showToast } = useApp();
  const router = useRouter();

  if (!user) return null;

  const rank = rankFor(user.points);
  const completed = signups.filter((s) => s.status === 'completed').length;
  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleDownload = async () => {
    try {
      await downloadCertificate({ ...user, rank: rank.name });
    } catch (e) {
      showToast('Error generating certificate.');
    }
  };

  const handleLogout = () => {
    signOut();
    router.replace('/(auth)/sign-in');
  };

  return (
    <View style={globalStyles.container}>
      <Header title="Profile" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={globalStyles.screen}>
        
        {/* Profile Header */}
        <View style={[globalStyles.card, { alignItems: 'center', paddingTop: 24 }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <View style={[globalStyles.row, { justifyContent: 'center', gap: 8 }]}>
            <View style={[globalStyles.pill, globalStyles.pillGreen]}>
              <Text style={[globalStyles.pillText, globalStyles.pillTextGreen]}>{rank.emoji} {rank.name}</Text>
            </View>
            <View style={[globalStyles.pill, globalStyles.pillGold]}>
              <Text style={[globalStyles.pillText, globalStyles.pillTextGold]}>{user.points} pts</Text>
            </View>
          </View>
        </View>

        {/* User Details List */}
        <View style={globalStyles.card}>
          <View style={[styles.listRow, { paddingTop: 0 }]}>
            <View style={globalStyles.row}>
              <MapPin size={18} color={COLORS.textDim} />
              <Text style={globalStyles.mutedText}>Hometown</Text>
            </View>
            <Text style={globalStyles.boldText}>{user.hometown}</Text>
          </View>
          <View style={styles.listRow}>
            <View style={globalStyles.row}>
              <Mail size={18} color={COLORS.textDim} />
              <Text style={globalStyles.mutedText}>Email</Text>
            </View>
            <Text style={[globalStyles.boldText, { fontSize: 13 }]}>{user.email}</Text>
          </View>
          <View style={styles.listRow}>
            <View style={globalStyles.row}>
              <Users size={18} color={COLORS.textDim} />
              <Text style={globalStyles.mutedText}>Team</Text>
            </View>
            <Text style={globalStyles.boldText}>{user.team || 'None'}</Text>
          </View>
          <View style={[styles.listRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={globalStyles.row}>
              <ShieldCheck size={18} color={COLORS.textDim} />
              <Text style={globalStyles.mutedText}>Location services</Text>
            </View>
            <View style={[globalStyles.pill, globalStyles.pillGreen]}>
              <Text style={[globalStyles.pillText, globalStyles.pillTextGreen]}>On</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{user.totalHours}h</Text>
            <Text style={styles.statLbl}>Verified hours</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{completed || user.cleanups}</Text>
            <Text style={styles.statLbl}>Cleanups done</Text>
          </View>
        </View>

        {/* Certificate Card */}
        <View style={styles.hero}>
          <View style={[globalStyles.row, { gap: 10, marginBottom: 8 }]}>
            <Award size={22} color={COLORS.gold} />
            <Text style={styles.heroTitle}>Volunteer hours certificate</Text>
          </View>
          <Text style={[globalStyles.mutedText, { fontSize: 13, marginBottom: 14 }]}>
            Download a verified PDF of your {user.totalHours} hours — great for school, scholarships, or service requirements.
          </Text>
          <TouchableOpacity style={[globalStyles.btn, globalStyles.btnPrimary]} onPress={handleDownload}>
            <Download size={18} color="#06150f" />
            <Text style={[globalStyles.btnText, globalStyles.btnPrimaryText]}>Download certificate</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[globalStyles.btn, globalStyles.btnOutline]} onPress={handleLogout}>
          <LogOut size={18} color={COLORS.text} />
          <Text style={globalStyles.btnText}>Log out</Text>
        </TouchableOpacity>

        <Text style={[globalStyles.faintText, { textAlign: 'center', fontSize: 12, marginTop: 24 }]}>
          Ripple · Expo App Demo
        </Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surface3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textDim,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    padding: 16,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLbl: {
    fontSize: 12,
    color: COLORS.textDim,
  },
  hero: {
    backgroundColor: '#1b1b24', // deep blueish tint
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: '#292936',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
});
