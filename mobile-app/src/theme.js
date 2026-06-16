import { StyleSheet } from 'react-native';

export const COLORS = {
  bg: '#F8F6F0',
  surface: '#FFFFFF',
  surface2: '#EFECE5',
  surface3: '#E4E0D5',
  border: '#DDD8CD',
  text: '#1C2B36',
  textDim: '#5A6B7C',
  textFaint: '#94A3B3',
  green: '#4C8DAD',
  greenSoft: '#E8EFF3',
  teal: '#38BDF8',
  red: '#D93838',
  redSoft: '#FDECEC',
  orange: '#E26D23',
  blue: '#2965CC',
  gold: '#C69A27',
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
    color: '#FFFFFF',
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
    backgroundColor: '#FCE6D5',
  },
  pillBlue: {
    backgroundColor: '#E8F0FE',
  },
  pillGold: {
    backgroundColor: '#FDF7E6',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pillTextGreen: { color: '#2A5469' },
  pillTextRed: { color: '#A32626' },
  pillTextOrange: { color: '#B35116' },
  pillTextBlue: { color: '#1A4E9E' },
  pillTextGold: { color: '#8A6812' },
});
