import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const SECTIONS = [
  {
    title: '1. Introduction',
    body: `Welcome to Sudoku Kids ("the App"). This Privacy Policy explains how we handle information when you use our App. We are committed to protecting the privacy of all users, especially children under the age of 18.

The App is designed for users aged 13 and above.`,
  },
  {
    title: '2. Information We Do NOT Collect',
    body: `Sudoku Kids does NOT collect, store, or transmit any personal information. Specifically, we do not collect:

• Names, email addresses, or contact details
• Location data
• Device identifiers or advertising IDs
• Photos, camera, or microphone data
• Any data from children

The App works entirely offline and does not require an internet connection.`,
  },
  {
    title: '3. Data Stored on Your Device',
    body: `The App stores the following data locally on your device only, using AsyncStorage:

• Your current game progress (board state, timer, difficulty)
• Your theme preference (dark or light mode)

This data never leaves your device and is not accessible to us or any third party.`,
  },
  {
    title: '4. Third-Party Services',
    body: `Sudoku Kids does not use any third-party analytics, advertising networks, or tracking services. There are no ads in this App.`,
  },
  {
    title: '5. Children\'s Privacy (COPPA Compliance)',
    body: `We take children's privacy seriously. The App is intended for users aged 13 and above. We do not knowingly collect any personal information from children under 13. If you believe a child under 13 is using the App, please contact us and we will take appropriate action.`,
  },
  {
    title: '6. Permissions',
    body: `Sudoku Kids does not request any device permissions. It does not access your camera, microphone, contacts, location, or any other sensitive device feature.`,
  },
  {
    title: '7. Security',
    body: `Since we do not collect or transmit any personal data, there is no risk of your personal information being exposed through our App. All game data is stored locally on your device.`,
  },
  {
    title: '8. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. Any changes will be reflected in an updated version of the App on Google Play. We encourage you to review this policy periodically.`,
  },
  {
    title: '9. Contact Us',
    body: `If you have any questions or concerns about this Privacy Policy, please contact us at:

📧 support@sudokukids.app

We will respond to all inquiries within 7 business days.`,
  },
];

export default function PrivacyScreen({ navigation }) {
  const { theme, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.back, { color: theme.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>🔒 Privacy Policy</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.banner, { backgroundColor: theme.primary + '18', borderColor: theme.primary }]}>
          <Text style={[styles.bannerText, { color: theme.primary }]}>
            🛡️ Sudoku Kids collects NO personal data. No ads. No tracking. Safe for kids 13+.
          </Text>
        </View>

        <Text style={[styles.updated, { color: theme.subtext }]}>Last updated: January 2025</Text>

        {SECTIONS.map((s, i) => (
          <View key={i} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{s.title}</Text>
            <Text style={[styles.sectionBody, { color: theme.subtext }]}>{s.body}</Text>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  back: { fontSize: 15, fontWeight: '600', width: 60 },
  title: { fontSize: 20, fontWeight: '800' },
  content: { paddingHorizontal: 16, paddingTop: 8 },
  banner: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  bannerText: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  updated: { fontSize: 12, marginBottom: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  sectionBody: { fontSize: 14, lineHeight: 22 },
});
