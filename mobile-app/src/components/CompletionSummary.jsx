import React from 'react';
import { View, Text, Modal, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle2, Clock, TrendingUp, Sparkles } from 'lucide-react-native';
import { rankFor, nextRank } from '../data/mockData';
import { COLORS, SIZES, globalStyles } from '../theme';

export default function CompletionSummary({ signup, user, onClose }) {
  if (!signup) return null;

  const hours = signup.actualHours || signup.estimatedHours;
  const points = Math.round(hours * 50);

  const projectedPoints = (user.points || 0) + points;
  const rank = rankFor(projectedPoints);
  const next = nextRank(projectedPoints);
  const toNext = next ? next.min - projectedPoints : 0;

  let progressWidth = 0;
  if (next) {
    progressWidth = Math.min(100, Math.round(((projectedPoints - rank.min) / (next.min - rank.min)) * 100));
  }

  return (
    <Modal visible={!!signup} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.modal} onPress={() => {}}>
          <View style={styles.grab} />

          <View style={styles.header}>
            <Text style={{ fontSize: 56 }}>🎉</Text>
            <Text style={styles.title}>Cleanup complete!</Text>
            <Text style={styles.subtitle}>
              Thanks for cleaning up <Text style={globalStyles.boldText}>{signup.title}</Text>
            </Text>
          </View>

          {/* Before / after */}
          {(signup.beforePhotoURL || signup.afterPhotoURL) && (
            <View style={styles.beforeAfter}>
              <View style={styles.baCol}>
                <Text style={styles.baLabel}>Before</Text>
                <Image source={{ uri: signup.beforePhotoURL }} style={styles.baImg} />
              </View>
              <View style={styles.baCol}>
                <Text style={styles.baLabel}>After</Text>
                <Image source={{ uri: signup.afterPhotoURL }} style={styles.baImg} />
              </View>
            </View>
          )}

          {/* Impact stats */}
          <View style={styles.statGrid}>
            <View style={globalStyles.card}>
              <Text style={styles.statNum}>{hours}h</Text>
              <View style={[globalStyles.row, { gap: 4, marginTop: 4 }]}>
                <Clock size={12} color={COLORS.textDim} />
                <Text style={globalStyles.mutedText}>hours logged</Text>
              </View>
            </View>
            <View style={globalStyles.card}>
              <Text style={[styles.statNum, { color: COLORS.gold }]}>+{points}</Text>
              <View style={[globalStyles.row, { gap: 4, marginTop: 4 }]}>
                <Sparkles size={12} color={COLORS.textDim} />
                <Text style={globalStyles.mutedText}>points earned</Text>
              </View>
            </View>
          </View>

          {/* Rank progress */}
          {next && (
            <View style={[globalStyles.card, { marginTop: 4, marginBottom: 0 }]}>
              <View style={[globalStyles.row, globalStyles.between, { marginBottom: 8 }]}>
                <View style={[globalStyles.row, { gap: 6 }]}>
                  <TrendingUp size={16} color={COLORS.teal} />
                  <Text style={globalStyles.boldText}>Almost there</Text>
                </View>
                <Text style={[globalStyles.faintText, { fontSize: 12 }]}>
                  {toNext} pts to {next.name} {next.emoji}
                </Text>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${progressWidth}%` }]} />
              </View>
            </View>
          )}

          <View style={[globalStyles.row, { justifyContent: 'center', marginVertical: 16 }]}>
            <CheckCircle2 size={16} color={COLORS.green} />
            <Text style={[globalStyles.mutedText, { fontSize: 13, flexShrink: 1 }]}>
              Sent to admin — points & hours confirm after verification
            </Text>
          </View>

          <TouchableOpacity style={[globalStyles.btn, globalStyles.btnPrimary, { marginTop: 10 }]} onPress={onClose}>
            <Text style={[globalStyles.btnText, globalStyles.btnPrimaryText]}>Done</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  grab: {
    width: 42,
    height: 5,
    borderRadius: 5,
    backgroundColor: COLORS.surface3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textDim,
    textAlign: 'center',
  },
  beforeAfter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  baCol: {
    flex: 1,
  },
  baLabel: {
    fontSize: 11,
    color: COLORS.textDim,
    marginBottom: 5,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  baImg: {
    width: '100%',
    height: 110,
    borderRadius: 12,
    backgroundColor: COLORS.surface3,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  statNum: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
  },
  progressBg: {
    height: 10,
    backgroundColor: COLORS.surface3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.teal, // using teal, would be gradient in css
    borderRadius: 10,
  },
});
