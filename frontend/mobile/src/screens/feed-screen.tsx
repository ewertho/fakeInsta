import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { PostCard } from "../components/post-card";
import { api, assetUrl } from "../lib/api";
import { socket } from "../lib/socket";
import type { Post, StoryItem } from "../types";

export function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const load = useCallback(async () => {
    try {
      const [postsRes, storiesRes] = await Promise.all([
        api.get<Post[]>("/posts"),
        api.get<StoryItem[]>("/stories"),
      ]);
      setPosts(postsRes.data);
      setStories(storiesRes.data);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    function handlePostCreated(post: Post) {
      setPosts((current) => [post, ...current]);
    }

    function handlePostLiked(updated: Post) {
      setPosts((current) => current.map((p) => (p.id === updated.id ? updated : p)));
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
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Não foi possível carregar. Confira EXPO_PUBLIC_API_URL e a API.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={posts}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        stories.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesWrap}>
            {stories.map((story) => {
              const avatar = story.user.avatarUrl?.startsWith("http")
                ? story.user.avatarUrl
                : story.user.avatarUrl
                  ? `${assetUrl}${story.user.avatarUrl}`
                  : `https://i.pravatar.cc/150?u=${story.user.username}`;

              return (
                <View key={story.id} style={styles.storyItem}>
                  <View style={styles.storyRing}>
                    <Image source={{ uri: avatar }} style={styles.storyAvatar} />
                  </View>
                  <Text numberOfLines={1} style={styles.storyLabel}>
                    {story.user.username}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        ) : null
      }
      renderItem={({ item }) => (
        <PostCard
          post={item}
          onUpdated={(updated) =>
            setPosts((current) => current.map((p) => (p.id === updated.id ? updated : p)))
          }
        />
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhuma publicação ainda.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: "#000000",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    padding: 24,
  },
  errorText: {
    color: "#ed4956",
    textAlign: "center",
  },
  storiesWrap: {
    maxHeight: 110,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#262626",
  },
  storyItem: {
    width: 76,
    alignItems: "center",
    marginRight: 8,
  },
  storyRing: {
    borderRadius: 999,
    padding: 2,
    backgroundColor: "#bc1888",
  },
  storyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#000",
  },
  storyLabel: {
    marginTop: 4,
    fontSize: 11,
    color: "#fff",
    maxWidth: 72,
    textAlign: "center",
  },
  empty: {
    padding: 40,
  },
  emptyText: {
    color: "#a8a8a8",
    textAlign: "center",
  },
});
