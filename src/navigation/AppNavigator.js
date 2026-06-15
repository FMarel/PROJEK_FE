import React from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "@/store/useAuthStore";
import LoginOrangTuaScreen from "@/screens/auth/LoginOrangTua";
import DashboardScreen from "@/screens/dashboard/Index";
import InformasiScreen from "@/screens/informasi/Index";
import DetailInformasiScreen from "@/screens/informasi/Detail";
import ProfilScreen from "@/screens/profil/Index";
import PerformaScreen from "@/screens/performa/Index";
import KeuanganScreen from "@/screens/keuangan/Index";
import JadwalScreen from "@/screens/jadwal/Index";
import JadwalDetailScreen from "@/screens/jadwal/Detail";
import RiwayatAkademikScreen from "@/screens/riwayat/Index";
import RiwayatDetailScreen from "@/screens/riwayat/Detail";
import KalenderAkademikScreen from "@/screens/KalenderAkademik/Index";
import IMPScreen from "@/screens/imp/Index";
import IMPDetailScreen from "@/screens/imp/Detail";
// import BukuPedomanScreen from "@/screens/bukuPedoman/Index";
// import PdfWebViewScreen from "@/screens/bukuPedoman/PdfWebView";
import RpsScreen from "@/screens/rps/Index";
import RpsDetailScreen from "@/screens/rps/Detail";

console.log("IMPDetailScreen:", IMPDetailScreen);
console.log("IMPScreen:", IMPScreen);

export const AppNavigator = () => {
  const token = useAuthStore((state) => state.token);
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);
  const Stack = createNativeStackNavigator();

  if (!_hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {token ? (
        <>
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Informasi" 
            component={InformasiScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="DetailInformasi" 
            component={DetailInformasiScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ProfilMahasiswa" 
            component={ProfilScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Performa" 
            component={PerformaScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Keuangan" 
            component={KeuanganScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Jadwal" 
            component={JadwalScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="JadwalDetail" 
            component={JadwalDetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Riwayat" 
            component={RiwayatAkademikScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="RiwayatDetail" 
            component={RiwayatDetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="KalenderAkademik" 
            component={KalenderAkademikScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
          name="IMP"
          component={IMPScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="IMPDetail"
          component={IMPDetailScreen}
          options={{ headerShown: false }}
        />

        {/* <Stack.Screen
          name="BukuPedoman"
          component={BukuPedomanScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PdfWebView"
          component={PdfWebViewScreen}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen 
            name="RPS" 
            component={RpsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="RPSDetail" 
            component={RpsDetailScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <Stack.Screen 
          name="LoginOrangTua" 
          component={LoginOrangTuaScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};