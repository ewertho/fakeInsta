import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

import { api } from "../lib/api";

export function CreatePostScreen() {
  const navigation = useNavigation();
  const [author, setAuthor] = useState("");
  const [place, setPlace] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function selectImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permissao necessaria", "Precisamos de acesso a galeria para anexar a imagem.");
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
    if (!imageUri || !author || !description) {
      Alert.alert("Campos obrigatorios", "Selecione uma imagem e preencha autor e descricao.");
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
    formData.append("author", author);
    formData.append("place", place);
    formData.append("description", description);
    formData.append("hashtags", hashtags);

    setIsSubmitting(true);

    try {
      await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigation.goBack();
    } catch {
      Alert.alert("Falha ao publicar", "Verifique se a API esta disponivel e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>CRIAR POST</Text>
        <Text style={styles.heroTitle}>Mesmo contrato da API nova, sem hacks antigos.</Text>
      </View>

      <Pressable onPress={selectImage} style={styles.imagePickerButton}>
        <Text style={styles.imagePickerText}>{imageUri ? "Trocar imagem" : "Selecionar imagem"}</Text>
      </Pressable>

      {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" /> : null}

      <Input label="Autor" value={author} onChangeText={setAuthor} />
      <Input label="Local" value={place} onChangeText={setPlace} />
      <Input label="Descricao" value={description} onChangeText={setDescription} multiline />
      <Input label="Hashtags" value={hashtags} onChangeText={setHashtags} />

      <Pressable onPress={submitPost} disabled={isSubmitting} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>{isSubmitting ? "Publicando..." : "Publicar"}</Text>
      </Pressable>
    </ScrollView>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
};

function Input({ label, value, onChangeText, multiline = false }: InputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline ? styles.inputMultiline : undefined]}
        placeholderTextColor="#a8a29e"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c0a09",
  },
  content: {
    gap: 16,
    padding: 16,
  },
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#1c1917",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  heroEyebrow: {
    color: "#fed7aa",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 4,
  },
  heroTitle: {
    marginTop: 8,
    color: "#fafaf9",
    fontSize: 28,
    fontWeight: "600",
  },
  imagePickerButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  imagePickerText: {
    color: "#f5f5f4",
    fontWeight: "500",
  },
  preview: {
    width: "100%",
    height: 288,
    borderRadius: 28,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    color: "#e7e5e4",
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#fafaf9",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputMultiline: {
    minHeight: 120,
  },
  submitButton: {
    alignItems: "center",
    borderRadius: 28,
    backgroundColor: "#fb923c",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  submitButtonText: {
    color: "#1c1917",
    fontWeight: "700",
  },
});
