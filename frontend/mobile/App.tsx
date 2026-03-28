import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import { RootNavigator } from "./src/navigation/root-navigator";
import "./global.css";

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#0c0a09",
    card: "#1c1917",
    text: "#fafaf9",
    border: "rgba(255,255,255,0.08)",
    primary: "#fb923c",
  },
};

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <StatusBar style="light" />
      <RootNavigator />
    </NavigationContainer>
  );
}
