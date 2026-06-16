import { StyleSheet } from 'react-native';

export const COLORS = {
  bg: '#0c0c0e',
  surface: '#161618',
  surface2: '#1f1f23',
  surface3: '#2a2a2f',
  border: '#2c2c31',
  text: '#f5f5f7',
  textDim: '#9a9aa2',
  textFaint: '#6b6b73',
  green: '#2fae7a',
  greenSoft: '#173f31',
  teal: '#36c2b4',
  red: '#ef3b2d',
  redSoft: '#4a2420',
  orange: '#f0762b',
  blue: '#3b6fe0',
  gold: '#e0b341',
  black: '#000000',
  white: '#ffffff',
};

export const SIZES = {
  radius: 16,
  radiusSm: 12,
  padding: 20,
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  screen: {
    flexGrow: 1,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  between: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    padding: 18,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginVertical: 12,
    marginTop: 22,
    letterSpacing: -0.3,
  },
  mutedText: {
    color: COLORS.textDim,
  },
  faintText: {
    color: COLORS.textFaint,
  },
  boldText: {
    fontWeight: '700',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  // Buttons
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    padding: 16,
    borderRadius: 40,
    backgroundColor: COLORS.surface3,
  },
  btnPrimary: {
    backgroundColor: COLORS.green,
  },
  btnRed: {
    backgroundColor: COLORS.red,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  btnSm: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  btnPrimaryText: {
    color: '#06150f',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  // Pills
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 30,
  },
  pillGreen: {
    backgroundColor: COLORS.greenSoft,
  },
  pillRed: {
    backgroundColor: COLORS.redSoft,
  },
  pillOrange: {
    backgroundColor: '#3d2a14',
  },
  pillBlue: {
    backgroundColor: '#1b2c4f',
  },
  pillGold: {
    backgroundColor: '#3a3017',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pillTextGreen: { color: '#5fe0a8' },
  pillTextRed: { color: '#ff8a7a' },
  pillTextOrange: { color: '#f3a45f' },
  pillTextBlue: { color: '#8fb3ff' },
  pillTextGold: { color: COLORS.gold },
});
