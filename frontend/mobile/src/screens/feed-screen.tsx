import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { api } from "../lib/api";
import { socket } from "../lib/socket";
import type { Post } from "../types";
import { PostCard } from "../components/post-card";

export function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await api.get<Post[]>("/posts");
        setPosts(response.data);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  useEffect(() => {
    function handlePostCreated(post: Post) {
      setPosts((current) => [post, ...current]);
    }

    function handlePostLiked(updatedPost: Post) {
      setPosts((current) => current.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
    }

    socket.on("post:created", handlePostCreated);
    socket.on("post:liked", handlePostLiked);

    return () => {
      socket.off("post:created", handlePostCreated);
      socket.off("post:liked", handlePostLiked);
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.helperText}>Carregando feed...</Text>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.helperText, styles.helperTextCenter]}>
          Nao consegui falar com a API. Ajuste EXPO_PUBLIC_API_URL se estiver em outro host.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostCard post={item} />}
      ListHeaderComponent={
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>MOBILE REFRESH</Text>
          <Text style={styles.heroTitle}>Expo com TypeScript e feed sincronizado.</Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhuma publicacao ainda.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: "#0c0a09",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0c0a09",
    paddingHorizontal: 24,
  },
  helperText: {
    color: "#e7e5e4",
    fontSize: 16,
  },
  helperTextCenter: {
    textAlign: "center",
  },
  heroCard: {
    marginBottom: 24,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(253,186,116,0.2)",
    backgroundColor: "rgba(251,146,60,0.1)",
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
  emptyState: {
    borderRadius: 28,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: "center",
    color: "#d6d3d1",
  },
});
