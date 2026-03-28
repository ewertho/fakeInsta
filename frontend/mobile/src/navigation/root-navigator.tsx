import { Image, Pressable } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { CreatePostScreen } from "../screens/create-post-screen";
import { FeedScreen } from "../screens/feed-screen";
import type { RootStackParamList } from "../types";
import logo from "../assets/logo.png";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#1c1917",
        },
        headerTintColor: "#fafaf9",
        contentStyle: {
          backgroundColor: "#0c0a09",
        },
      }}
    >
      <Stack.Screen
        name="Feed"
        component={FeedScreen}
        options={({ navigation }) => ({
          headerTitle: () => <Image source={logo} style={{ width: 110, height: 32, resizeMode: "contain" }} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("CreatePost")}
              style={{ paddingHorizontal: 10, paddingVertical: 6 }}
            >
              <Feather name="camera" size={20} color="#fb923c" />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{
          title: "Nova publicação",
        }}
      />
    </Stack.Navigator>
  );
}
