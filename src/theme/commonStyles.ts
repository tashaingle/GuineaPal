import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import colors from './colors';
import typography from './typography';

type Style = ViewStyle | TextStyle;
type StyleMap = { [key: string]: Style };

export const commonStyles = StyleSheet.create({
  // Screen containers
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  } as ViewStyle,
  contentContainer: {
    flex: 1,
    padding: 16,
  } as ViewStyle,

  // Headers
  header: {
    backgroundColor: colors.components.header.background,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.DEFAULT,
  } as ViewStyle,
  headerTitle: {
    ...typography.textStyles.h2,
    color: colors.components.header.text,
    textAlign: 'center',
  } as TextStyle,

  // Cards
  card: {
    backgroundColor: colors.components.card.background,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.components.card.border,
    shadowColor: colors.components.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  cardTitle: {
    ...typography.textStyles.h3,
    color: colors.text.primary,
    marginBottom: 8,
  } as TextStyle,
  cardContent: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
  } as TextStyle,

  // Buttons
  button: {
    backgroundColor: colors.buttons.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  buttonText: {
    ...typography.textStyles.button,
    color: colors.white,
  } as TextStyle,
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.buttons.primary,
  } as ViewStyle,
  buttonOutlineText: {
    ...typography.textStyles.button,
    color: colors.buttons.primary,
  } as TextStyle,

  // Form inputs
  input: {
    backgroundColor: colors.components.input.background,
    borderWidth: 1,
    borderColor: colors.components.input.border,
    borderRadius: 8,
    padding: 12,
    ...typography.textStyles.body,
    color: colors.text.primary,
  } as TextStyle,
  inputLabel: {
    ...typography.textStyles.label,
    color: colors.text.primary,
    marginBottom: 4,
  } as TextStyle,

  // Lists
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.white,
  } as ViewStyle,
  listItemText: {
    ...typography.textStyles.body,
    color: colors.text.primary,
    flex: 1,
  } as TextStyle,

  // Status indicators
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  } as ViewStyle,
  badgeText: {
    ...typography.textStyles.caption,
    color: colors.white,
  } as TextStyle,

  // Utility styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  spaceBetween: {
    justifyContent: 'space-between',
  } as ViewStyle,
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  mt8: { marginTop: 8 } as ViewStyle,
  mt16: { marginTop: 16 } as ViewStyle,
  mb8: { marginBottom: 8 } as ViewStyle,
  mb16: { marginBottom: 16 } as ViewStyle,
  mx16: { marginHorizontal: 16 } as ViewStyle,
  my16: { marginVertical: 16 } as ViewStyle,
  p16: { padding: 16 } as ViewStyle,
} as StyleMap);

export default commonStyles; 