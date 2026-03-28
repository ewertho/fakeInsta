import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

import { api } from "../lib/api";

export function CreatePostScreen() {
  const navigation = useNavigation();
  const [caption, setCaption] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function selectImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0]?.uri ?? null);
    }
  }

  async function submitPost() {
    if (!imageUri || !caption.trim()) {
      Alert.alert("Campos obrigatórios", "Selecione uma imagem e escreva uma legenda.");
      return;
    }

    const filename = imageUri.split("/").pop() ?? `upload-${Date.now()}.jpg`;
    const extension = filename.split(".").pop() ?? "jpg";

    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: filename,
      type: `image/${extension}`,
    } as never);
    formData.append("caption", caption.trim());

    setIsSubmitting(true);

    try {
      await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigation.goBack();
    } catch {
      Alert.alert("Falha ao publicar", "É preciso estar logado e a API disponível.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Novo post</Text>
        <Pressable onPress={submitPost} disabled={isSubmitting}>
          <Text style={styles.next}>{isSubmitting ? "…" : "Avançar"}</Text>
        </Pressable>
      </View>

      <Pressable onPress={selectImage} style={styles.previewWrap}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
        ) : (
          <Text style={styles.previewPlaceholder}>Toque para escolher foto</Text>
        )}
      </Pressable>

      <TextInput
        placeholder="Escreva uma legenda…"
        placeholderTextColor="#737373"
        value={caption}
        onChangeText={setCaption}
        multiline
        style={styles.caption}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
  next: {
    color: "#0095f6",
    fontWeight: "700",
    fontSize: 16,
  },
  previewWrap: {
    minHeight: 280,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  preview: {
    width: "100%",
    height: 320,
  },
  previewPlaceholder: {
    color: "#a8a8a8",
    padding: 24,
  },
  caption: {
    color: "#fff",
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: "top",
  },
});
