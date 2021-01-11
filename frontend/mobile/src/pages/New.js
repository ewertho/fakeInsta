import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from "react-native";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import api from "../services/Api";
import { useNavigation } from "@react-navigation/native";

function New() {
  const [author, setAuthor] = useState("");
  const [place, setPlace] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");

  const [image, setImage] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      if (Constants.platform !== "web") {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const UploadImage = async () => {
    const localUri = image;
    const filename = localUri.split("/").pop();

    let match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    try {
      console.log("he");
      const data = new FormData();

      data.append("image", { uri: localUri, name: filename, type });
      data.append("author", author);
      data.append("place", place);
      data.append("description", description);
      data.append("hashtags", hashtags);

      const response = await api.post("/posts", data);
      console.log(response);

      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
          <Text style={styles.selectButtonText}>Select Image</Text>
        </TouchableOpacity>
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: 200 }}
          />
        )}

        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Author"
          placeholderTextColor="#999"
          value={author}
          onChangeText={(author) => setAuthor(author)}
        />
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Place of Photo"
          placeholderTextColor="#999"
          value={place}
          onChangeText={(place) => setPlace(place)}
        />
        <View style={styles.inner}>
          <TextInput
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Description"
            placeholderTextColor="#999"
            value={description}
            onChangeText={(description) => setDescription(description)}
          />

          <TextInput
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Hashtagas"
            placeholderTextColor="#999"
            value={hashtags}
            onChangeText={(hashtags) => setHashtags(hashtags)}
          />
        </View>
        <TouchableOpacity style={styles.shareButton} onPress={UploadImage}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  inner: {
    justifyContent: "space-around",
  },
  newImage: {
    width: "100%",
    height: 400,
    marginVertical: 15,
  },
  selectButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#CCC",
    borderStyle: "dashed",
    height: 42,

    justifyContent: "center",
    alignItems: "center",
  },

  selectButtonText: {
    fontSize: 16,
    color: "#666",
  },

  preview: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: "center",
    borderRadius: 4,
  },

  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginTop: 10,
    fontSize: 16,
  },

  shareButton: {
    backgroundColor: "#7159c1",
    borderRadius: 4,
    height: 42,
    marginTop: 15,

    justifyContent: "center",
    alignItems: "center",
  },

  shareButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#FFF",
  },
});

export default New;
