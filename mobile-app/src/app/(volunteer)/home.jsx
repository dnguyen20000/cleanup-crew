import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, TrendingUp, Leaf, Clock, Award, ChevronRight, Users } from 'lucide-react-native';
import Header from '../../components/Header';
import { useApp } from '../../context/AppContext';
import { rankFor, nextRank, MOCK_LEADERBOARD } from '../../data/mockData';
import { COLORS, SIZES, globalStyles } from '../../theme';

export default function Home() {
  const { user, signups } = useApp();
  const router = useRouter();

  if (!user) return null;

  const rank = rankFor(user.points);
  const next = nextRank(user.points);
  const pct = next
    ? Math.min(100, Math.round((user.points / next.min) * 100))
    : 100;

  return (
    <View style={globalStyles.container}>
      <Header
        title={`Hi, ${user.name.split(' ')[0]}`}
        sub="Let’s make an impact today"
        right={
          <TouchableOpacity style={styles.iconBtn}>
            <Bell size={20} color={COLORS.text} />
          </TouchableOpacity>
        }
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={globalStyles.screen}>
        
        {/* Rank / progress hero */}
        <View style={[globalStyles.card, styles.rankBadge]}>
          <Text style={styles.rankEmoji}>{rank.emoji}</Text>
          <View style={{ flex: 1 }}>
            <View style={[globalStyles.row, globalStyles.between]}>
              <Text style={styles.rankName}>{rank.name}</Text>
              <View style={[globalStyles.pill, globalStyles.pillGreen]}>
                <Text style={[globalStyles.pillText, globalStyles.pillTextGreen]}>{user.points} pts</Text>
              </View>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${pct}%` }]} />
            </View>
            <Text style={styles.faintText}>
              {next ? `${next.min - user.points} pts to ${next.name} ${next.emoji}` : 'Max rank reached 🎉'}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{user.totalHours}h</Text>
            <View style={globalStyles.row}>
              <Clock size={12} color={COLORS.textDim} />
              <Text style={styles.statLbl}>Volunteer hours</Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{rank.emoji}</Text>
            <View style={globalStyles.row}>
              <Award size={12} color={COLORS.textDim} />
              <Text style={styles.statLbl}>{rank.name}</Text>
            </View>
          </View>
        </View>

        {/* Team leaderboard */}
        <View style={[globalStyles.row, { marginTop: 22, marginBottom: 12 }]}>
          <Users size={18} color={COLORS.text} style={{ marginRight: 6 }} />
          <Text style={[globalStyles.sectionTitle, { marginTop: 0, marginVertical: 0 }]}>Team leaderboard</Text>
        </View>
        
        <View style={[globalStyles.card, { padding: 6 }]}>
          {MOCK_LEADERBOARD.map((t, i) => (
            <View
              key={t.name}
              style={[
                styles.listRow,
                i !== MOCK_LEADERBOARD.length - 1 && { borderBottomWidth: 1, borderBottomColor: COLORS.border }
              ]}
            >
              <View style={globalStyles.row}>
                <Text style={{ width: 22, fontWeight: '800', color: i === 0 ? COLORS.gold : COLORS.textFaint }}>
                  {i + 1}
                </Text>
                <View>
                  <Text style={globalStyles.boldText}>{t.name}</Text>
                  <Text style={[globalStyles.faintText, { fontSize: 12 }]}>
                    {t.members} members
                  </Text>
                </View>
              </View>
              <View style={[globalStyles.pill, globalStyles.pillGreen]}>
                <Text style={[globalStyles.pillText, globalStyles.pillTextGreen]}>{t.points.toLocaleString()}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={[globalStyles.btn, globalStyles.btnOutline, { marginTop: 16 }]} onPress={() => router.push('/map')}>
          <TrendingUp size={18} color={COLORS.text} />
          <Text style={globalStyles.btnText}>See cleanup hot spots</Text>
          <ChevronRight size={18} color={COLORS.text} />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  rankEmoji: {
    fontSize: 40,
  },
  rankName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  progressBg: {
    height: 8,
    backgroundColor: COLORS.surface3,
    borderRadius: 4,
    marginVertical: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.green,
    borderRadius: 4,
  },
  faintText: {
    fontSize: 12,
    color: COLORS.textFaint,
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
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
});
