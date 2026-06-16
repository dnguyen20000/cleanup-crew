import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Clock } from 'lucide-react-native';
import { COLORS, SIZES, globalStyles } from '../../theme';

export default function AdminVerify() {
  const { signups, approveCompletion } = useApp();
  const pending = signups.filter((s) => s.status === 'pending');
  const done = signups.filter((s) => s.status === 'completed');

  return (
    <View style={globalStyles.container}>
      <Header title="Verify" sub="Approve before/after proof" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={globalStyles.screen}>
        
        <Text style={[globalStyles.sectionTitle, { marginTop: 0 }]}>
          Pending review ({pending.length})
        </Text>

        {pending.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No submissions waiting.</Text>
            <Text style={styles.emptyText}>Approved cleanups award volunteer hours + points.</Text>
          </View>
        )}

        {pending.map((s) => (
          <View key={s.id} style={globalStyles.card}>
            <View style={[globalStyles.row, globalStyles.between, { marginBottom: 12 }]}>
              <Text style={globalStyles.boldText}>{s.title}</Text>
              <View style={[globalStyles.pill, globalStyles.pillOrange]}>
                <Clock size={12} color="#f3a45f" />
                <Text style={[globalStyles.pillText, globalStyles.pillTextOrange]}>Pending</Text>
              </View>
            </View>

            <View style={styles.beforeAfter}>
              <View style={styles.baCol}>
                <View style={styles.baLabelContainer}>
                  <Text style={styles.baLabel}>Before</Text>
                </View>
                <Image source={{ uri: s.beforePhotoURL }} style={styles.baImage} />
              </View>
              <View style={styles.baCol}>
                <View style={styles.baLabelContainer}>
                  <Text style={styles.baLabel}>After</Text>
                </View>
                <Image source={{ uri: s.afterPhotoURL }} style={styles.baImage} />
              </View>
            </View>

            <Text style={[globalStyles.mutedText, { fontSize: 13, marginVertical: 12 }]}>
              Will award {s.actualHours || s.estimatedHours}h + {Math.round((s.actualHours || s.estimatedHours) * 50)} pts on approval
            </Text>

            <TouchableOpacity 
              style={[globalStyles.btn, globalStyles.btnPrimary]}
              onPress={() => approveCompletion(s.id)}
            >
              <CheckCircle2 size={18} color="#06150f" />
              <Text style={[globalStyles.btnText, globalStyles.btnPrimaryText]}>Approve & award hours</Text>
            </TouchableOpacity>
          </View>
        ))}

        {done.length > 0 && (
          <>
            <Text style={globalStyles.sectionTitle}>Verified ({done.length})</Text>
            {done.map((s) => (
              <View key={s.id} style={globalStyles.card}>
                <View style={[globalStyles.row, globalStyles.between]}>
                  <View>
                    <Text style={globalStyles.boldText}>{s.title}</Text>
                    <Text style={[globalStyles.mutedText, { fontSize: 13, marginTop: 3 }]}>
                      {s.eventDate}
                    </Text>
                  </View>
                  <View style={[globalStyles.pill, globalStyles.pillGreen]}>
                    <Text style={[globalStyles.pillText, globalStyles.pillTextGreen]}>
                      +{s.hoursAwarded}h · +{s.pointsAwarded} pts
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyBox: {
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  emptyText: {
    color: COLORS.textFaint,
    textAlign: 'center',
  },
  beforeAfter: {
    flexDirection: 'row',
    gap: 12,
  },
  baCol: {
    flex: 1,
  },
  baLabelContainer: {
    backgroundColor: COLORS.surface3,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  baLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDim,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  baImage: {
    width: '100%',
    height: 120,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: COLORS.surface2,
  }
});
