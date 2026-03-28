import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { api, assetUrl } from "../lib/api";
import type { Post } from "../types";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  async function handleLike() {
    await api.post(`/posts/${post.id}/like`);
  }

  return (
    <View style={styles.card}>
      <Image source={{ uri: `${assetUrl}${post.imageUrl}` }} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.authorBlock}>
            <Text style={styles.author}>{post.author}</Text>
            <Text style={styles.place}>{post.place || "Sem localização definida"}</Text>
          </View>

          <Pressable onPress={handleLike} style={styles.likeButton}>
            <Feather name="heart" size={16} color="#fdba74" />
            <Text style={styles.likeButtonText}>Curtir</Text>
          </Pressable>
        </View>

        <Text style={styles.likes}>{post.likes} curtidas</Text>
        <Text style={styles.description}>{post.description}</Text>
        {post.hashtags ? <Text style={styles.hashtags}>{post.hashtags}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    overflow: "hidden",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#1c1917",
  },
  image: {
    width: "100%",
    height: 320,
  },
  content: {
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  authorBlock: {
    flex: 1,
  },
  author: {
    color: "#fafaf9",
    fontSize: 20,
    fontWeight: "600",
  },
  place: {
    marginTop: 4,
    color: "#d6d3d1",
    fontSize: 14,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  likeButtonText: {
    color: "#f5f5f4",
    fontSize: 14,
  },
  likes: {
    color: "#fed7aa",
    fontSize: 14,
  },
  description: {
    color: "#f5f5f4",
    fontSize: 16,
    lineHeight: 24,
  },
  hashtags: {
    color: "#fdba74",
    fontSize: 14,
  },
});
