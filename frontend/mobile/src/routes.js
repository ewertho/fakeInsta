import React from "react";
import { Image, Button, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import Feed from "./pages/Feed";
import New from "./pages/New";
import { useNavigation } from "@react-navigation/native";
import logo from "./assets/logo.png";
import Right from "./components/TopBarRight";

function Routes() {
  const Route = createStackNavigator();

  //const navigation = useNavigation();
  return (
    <Route.Navigator initialRouteName="Feed">
      <Route.Screen
        name="Feed"
        component={Feed}
        options={{
          headerTintColor: "#fd4",
          headerTitle: () => <Image source={logo} />,
          headerBackTitle: null,
          headerRight: () => <Right />,
        }}
      />
      <Route.Screen
        name="New"
        component={New}
        options={{ headerTitleAlign: "center", headerTitle: "New publish" }}
      />
    </Route.Navigator>
  );
}

export default Routes;
