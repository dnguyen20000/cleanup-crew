import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Users, Clock, MapPin, CheckCircle2 } from 'lucide-react-native';
import Header from '../../components/Header';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, globalStyles } from '../../theme';

export default function AdminDashboard() {
  const { user, listings, signups } = useApp();

  if (!user) return null;

  const totalVolunteers = listings.reduce((a, l) => a + l.signupCount, 0);
  const pending = signups.filter((s) => s.status === 'pending').length;
  const completed = signups.filter((s) => s.status === 'completed').length;
  const hoursLogged = signups
    .filter((s) => s.status === 'completed')
    .reduce((a, s) => a + (s.actualHours || 0), 0);

  return (
    <View style={globalStyles.container}>
      <Header title="Admin" sub={`Welcome, ${user.name.split(' ')[0]}`} />
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={globalStyles.screen}>
        
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={[globalStyles.mutedText, { fontSize: 13 }]}>Community impact this season</Text>
          <Text style={styles.heroNum}>{Number(hoursLogged.toFixed(1))}h</Text>
          <Text style={[globalStyles.mutedText, { fontSize: 13 }]}>
            volunteer hours logged across {listings.length} active hot spots
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{listings.length}</Text>
            <View style={globalStyles.row}>
              <MapPin size={12} color={COLORS.textDim} />
              <Text style={styles.statLbl}>Active listings</Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{totalVolunteers}</Text>
            <View style={globalStyles.row}>
              <Users size={12} color={COLORS.textDim} />
              <Text style={styles.statLbl}>Volunteers signed up</Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, pending > 0 && { color: COLORS.orange }]}>{pending}</Text>
            <View style={globalStyles.row}>
              <Clock size={12} color={COLORS.textDim} />
              <Text style={styles.statLbl}>Pending review</Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{completed}</Text>
            <View style={globalStyles.row}>
              <CheckCircle2 size={12} color={COLORS.textDim} />
              <Text style={styles.statLbl}>Verified cleanups</Text>
            </View>
          </View>
        </View>

        <Text style={globalStyles.sectionTitle}>Your hot spots</Text>
        
        {listings.map((l) => (
          <View key={l.id} style={globalStyles.card}>
            <View style={[globalStyles.row, globalStyles.between]}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={globalStyles.boldText} numberOfLines={1}>{l.title}</Text>
                <Text style={[globalStyles.mutedText, { fontSize: 13, marginTop: 3 }]}>
                  {l.eventDate} · {l.startTime}–{l.endTime}
                </Text>
              </View>
              <View style={[globalStyles.pill, globalStyles.pillBlue]}>
                <Text style={[globalStyles.pillText, globalStyles.pillTextBlue]}>
                  {l.signupCount}/{l.capacity}
                </Text>
              </View>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${Math.min(100, (l.signupCount / l.capacity) * 100)}%` }]} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: COLORS.surface3,
    padding: 20,
    borderRadius: SIZES.radius,
    marginBottom: 14,
  },
  heroNum: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.text,
    marginVertical: 4,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    padding: 16,
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
  progressBg: {
    height: 6,
    backgroundColor: COLORS.surface3,
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.blue,
    borderRadius: 3,
  },
});
