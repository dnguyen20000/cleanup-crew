import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, globalStyles } from '../../theme';

export default function SignIn() {
  const { signIn } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState('volunteer');
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState('');
  const [hometown, setHometown] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) return;
    setLoading(true);
    const success = await signIn(
      {
        name: name || (tab === 'admin' ? 'Admin User' : 'Volunteer'),
        hometown,
        organization,
        email,
        password,
        isSignup
      },
      tab
    );
    setLoading(false);
    if (success) {
      router.replace(tab === 'admin' ? '/(admin)/dashboard' : '/(volunteer)/home');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={globalStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.auth}>
          <Image source={require('../../../assets/images/icon.png')} style={{ width: 140, height: 140, alignSelf: 'center', borderRadius: 28, marginBottom: 8 }} resizeMode="contain" />
          {/* <Text style={styles.h1}>Ripple</Text> */}
          <Text style={styles.tag}>Pick up litter. Earn rewards. Build community.</Text>

          <View style={styles.roleToggle}>
            <TouchableOpacity 
              style={[styles.roleBtn, tab === 'volunteer' && styles.roleBtnActive]} 
              onPress={() => setTab('volunteer')}
            >
              <Text style={[styles.roleBtnText, tab === 'volunteer' && styles.roleBtnTextActive]}>Volunteer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.roleBtn, tab === 'admin' && styles.roleBtnActive]} 
              onPress={() => setTab('admin')}
            >
              <Text style={[styles.roleBtnText, tab === 'admin' && styles.roleBtnTextActive]}>Admin</Text>
            </TouchableOpacity>
          </View>

          <View style={[globalStyles.row, { justifyContent: 'center', marginVertical: 12 }]}>
            <TouchableOpacity onPress={() => setIsSignup(true)} style={globalStyles.row}>
              <View style={[styles.radio, isSignup && styles.radioActive]} />
              <Text style={styles.radioLabel}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsSignup(false)} style={[globalStyles.row, { marginLeft: 16 }]}>
              <View style={[styles.radio, !isSignup && styles.radioActive]} />
              <Text style={styles.radioLabel}>Log In</Text>
            </TouchableOpacity>
          </View>

          {isSignup && (
            <>
              <View style={styles.field}>
                <Text style={styles.label}>Name</Text>
                <TextInput 
                  style={styles.input} 
                  value={name} 
                  onChangeText={setName} 
                  placeholder="Your name" 
                  placeholderTextColor={COLORS.textDim}
                />
              </View>
              {tab === 'volunteer' && (
                <View style={styles.field}>
                  <Text style={styles.label}>Hometown</Text>
                  <TextInput 
                    style={styles.input} 
                    value={hometown} 
                    onChangeText={setHometown} 
                    placeholder="City, State" 
                    placeholderTextColor={COLORS.textDim}
                  />
                </View>
              )}
              {tab === 'admin' && (
                <View style={styles.field}>
                  <Text style={styles.label}>Organization</Text>
                  <TextInput 
                    style={styles.input} 
                    value={organization} 
                    onChangeText={setOrganization} 
                    placeholder="e.g. City of Atlanta" 
                    placeholderTextColor={COLORS.textDim}
                  />
                </View>
              )}
            </>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput 
              style={styles.input} 
              value={email} 
              onChangeText={setEmail} 
              placeholder="you@email.com" 
              placeholderTextColor={COLORS.textDim}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input} 
              value={password} 
              onChangeText={setPassword} 
              placeholder="••••••••" 
              placeholderTextColor={COLORS.textDim}
              secureTextEntry
            />
          </View>


          <TouchableOpacity 
            style={[globalStyles.btn, globalStyles.btnPrimary, { marginTop: 8 }, loading && globalStyles.btnDisabled]} 
            onPress={submit} 
            disabled={loading}
          >
            <Text style={[globalStyles.btnText, globalStyles.btnPrimaryText]}>
              {loading ? 'Processing...' : isSignup ? 'Create Account' : 'Log In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  auth: {
    gap: 14,
  },
  logo: {
    fontSize: 60,
    textAlign: 'center',
  },
  h1: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    color: COLORS.text,
    marginTop: 8,
  },
  tag: {
    textAlign: 'center',
    color: COLORS.textDim,
    marginTop: 6,
    marginBottom: 22,
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface2,
    borderRadius: 40,
    padding: 4,
    marginVertical: 4,
  },
  roleBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 40,
    alignItems: 'center',
  },
  roleBtnActive: {
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  roleBtnText: {
    fontWeight: '700',
    color: COLORS.textDim,
    fontSize: 14,
  },
  roleBtnTextActive: {
    color: COLORS.text,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.textDim,
  },
  radioActive: {
    borderColor: COLORS.green,
    backgroundColor: COLORS.green,
  },
  radioLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  field: {
    gap: 6,
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: COLORS.textDim,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    color: COLORS.text,
    fontSize: 15,
  },
});
