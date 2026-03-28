import { Pressable, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { LoginScreen } from "../screens/login-screen";
import { FeedScreen } from "../screens/feed-screen";
import { ReelsScreen } from "../screens/reels-screen";
import { ProfileScreen } from "../screens/profile-screen";
import { MessagesScreen } from "../screens/messages-screen";
import { CreatePostScreen } from "../screens/create-post-screen";
import { useAuth } from "../lib/auth-context";
import type { RootStackParamList } from "../types";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#000000",
    card: "#000000",
    text: "#ffffff",
    border: "#262626",
    primary: "#0095f6",
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#000000" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "600" },
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopColor: "#262626",
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#737373",
      }}
    >
      <Tab.Screen
        name="Home"
        component={FeedScreen}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>FakeInsta</Text>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.getParent()?.navigate("CreatePost")}
              style={{ paddingHorizontal: 12 }}
            >
              <Feather name="plus-square" size={26} color="#fff" />
            </Pressable>
          ),
          tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
        })}
      />
      <Tab.Screen
        name="Search"
        component={SearchPlaceholder}
        options={{
          title: "Pesquisa",
          tabBarIcon: ({ color, size }) => <Feather name="search" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Reels"
        component={ReelsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name="film" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          title: "Mensagens",
          tabBarIcon: ({ color, size }) => <Feather name="send" color={color} size={size} />,
          tabBarBadge: 2,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Perfil",
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

function SearchPlaceholder() {
  return (
    <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "#a8a8a8" }}>Pesquisa (placeholder)</Text>
    </View>
  );
}

function Splash() {
  return (
    <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "#a8a8a8" }}>Carregando…</Text>
    </View>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{
          presentation: "modal",
          title: "Novo post",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  const { user, isReady } = useAuth();

  return (
    <NavigationContainer theme={navTheme}>
      {!isReady ? (
        <Splash />
      ) : !user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={LoginScreen} />
        </Stack.Navigator>
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
}
