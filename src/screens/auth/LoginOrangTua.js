import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useAuthOrangTua } from "@/hooks/useAuthOrangTua";
import { Button } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { AppText } from "@/components/ui/AppText";
import { COLORS } from "@/constants/theme";
import { showMessage } from "react-native-flash-message";
import { Eye, EyeOff, Fingerprint } from "lucide-react-native"; // Tambah Fingerprint
import { 
  checkBiometricSupportednEnrolled, 
  authenticateFingerPrint 
} from "@/utils/biometricHelper"; 
import * as SecureStore from 'expo-secure-store';

const LoginOrangTuaScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loginAction, loading } = useAuthOrangTua();

  // --- LOGIKA AUTO-FINGERPRINT ---
  useEffect(() => {
    const checkExistingLogin = async () => {
      const savedCreds = await SecureStore.getItemAsync('user_creds');
      if (savedCreds) {
        // Jika ada data tersimpan, langsung tawarkan fingerprint
        handleFingerprint();
      }
    };
    checkExistingLogin();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      showMessage({
        message: "Validasi",
        description: "Username dan password harus diisi",
        type: "warning",
      });
      return;
    }

    const result = await loginAction(username, password);
    if (result.success) {
      // Simpan kredensial untuk penggunaan fingerprint di masa depan
      await SecureStore.setItemAsync('user_creds', JSON.stringify({ username, password }));
    } else {
      showMessage({
        message: "Login Gagal",
        description: result.message,
        type: "danger",
      });
    }
  };

  const handleFingerprint = async () => {
    try {
      const isSupportedResult = await checkBiometricSupportednEnrolled();
      
      if (isSupportedResult === true) {
        const success = await authenticateFingerPrint();
        
        if (success) {
          const savedCreds = await SecureStore.getItemAsync('user_creds');
          
          if (savedCreds) {
            const { username: savedUser, password: savedPass } = JSON.parse(savedCreds);
            const loginResult = await loginAction(savedUser, savedPass);
            
            if (loginResult.success) {
              showMessage({
                message: "Berhasil",
                description: "Login otomatis berhasil",
                type: "success",
              });
            }
          } else {
            Alert.alert("Info", "Silakan login manual satu kali dulu untuk mendaftarkan akun di fitur Fingerprint.");
          }
        }
      } else {
        Alert.alert("Biometrik", isSupportedResult);
      }
    } catch (error) {
      showMessage({
        message: "Gagal",
        description: "Autentikasi dibatalkan",
        type: "danger",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.background}>
        <View style={styles.topCircle} />
        <View style={styles.bottomCircle} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/sia-logo.webp")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <AppText style={styles.appTitle}>SIA Orang Tua</AppText>

            <AppText style={styles.appSubtitle}>
              Sistem Informasi Akademik
            </AppText>
          </View>

          <View style={styles.formSection}>
            <AppInput
              label="USERNAME"
              placeholder="Masukkan username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
              <AppInput
                label="PASSWORD"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>

            <Button
              title="Masuk"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            {/* Bagian Fingerprint yang ditambahkan */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <AppText style={styles.dividerText}>atau</AppText>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.fingerprintButton}
              onPress={handleFingerprint}
            >
              <Fingerprint size={24} color="#2563EB" />
              <AppText style={styles.fingerprintText}>
                Login dengan Fingerprint
              </AppText>
            </TouchableOpacity>
          </View>

          <AppText style={styles.footerText}>
            © SIA Orang Tua
          </AppText>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginOrangTuaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 1,
    backgroundColor: "#1769C8",
  },

  topCircle: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -70,
    right: -80,
  },

  bottomCircle: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255,255,255,0.06)",
    bottom: -100,
    left: -100,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 74,
    paddingBottom: 40,
    justifyContent: "center",
  },

  headerSection: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  logo: {
    width: 78,
    height: 78,
  },

  appTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  appSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.78)",
    marginTop: 3,
  },

  formSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
  },

  passwordContainer: {
    position: "relative",
  },

  eyeButton: {
    position: "absolute",
    right: 12,
    top: 28,
    padding: 8,
  },

  loginButton: {
    marginTop: 10,
    backgroundColor: "#1F6FD2",
    borderRadius: 12,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  dividerText: {
    marginHorizontal: 12,
    color: "#94A3B8",
    fontSize: 12,
  },

  fingerprintButton: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#93C5FD",
    backgroundColor: "#F8FBFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  fingerprintText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 14,
  },

  footerText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    marginTop: 32,
  },
});