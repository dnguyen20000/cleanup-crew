import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../theme';

export default function Header({ title, sub, left, right }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 18 }]}>
      <View style={styles.leftGroup}>
        {left}
        <View>
          <Text style={styles.title}>{title}</Text>
          {sub && <Text style={styles.sub}>{sub}</Text>}
        </View>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: COLORS.bg,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: 13,
    color: COLORS.textDim,
    marginTop: 2,
  },
});
