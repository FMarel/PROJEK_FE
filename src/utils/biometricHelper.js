import * as LocalAuthentication from 'expo-local-authentication';

export const checkBiometricSupportednEnrolled = async () => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return "Perangkat tidak mendukung sensor biometrik.";

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) return "Belum ada data sidik jari di perangkat ini.";

    return true;
  } catch (error) {
    return "Gagal memverifikasi sensor biometrik.";
  }
};

export const authenticateFingerPrint = async () => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login dengan Biometrik',
      fallbackLabel: 'Gunakan PIN',
    });
    return result.success;
  } catch (error) {
    return false;
  }
};