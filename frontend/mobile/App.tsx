import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "./src/lib/auth-context";
import { RootNavigator } from "./src/navigation/root-navigator";

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
  );
}
