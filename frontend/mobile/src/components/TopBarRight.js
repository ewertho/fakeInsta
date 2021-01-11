import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

function TopBarRight() {
  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => navigation.navigate("New")}
      >
        <FontAwesome name="camera" size={20} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => navigation.navigate("New")}
      >
        <FontAwesome name="trash-o" size={20} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => navigation.navigate("New")}
      >
        <MaterialIcons name="send-to-mobile" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
}

export default TopBarRight;
