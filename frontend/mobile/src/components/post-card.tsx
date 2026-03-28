import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { api, assetUrl } from "../lib/api";
import type { Post } from "../types";

type PostCardProps = {
  post: Post;
  onUpdated?: (post: Post) => void;
};

function formatRelative(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days} d`;
}

export function PostCard({ post, onUpdated }: PostCardProps) {
  const avatar = post.author.avatarUrl?.startsWith("http")
    ? post.author.avatarUrl
    : post.author.avatarUrl
      ? `${assetUrl}${post.author.avatarUrl}`
      : `https://i.pravatar.cc/150?u=${post.author.username}`;

  const imageSrc = post.imageUrl.startsWith("http") ? post.imageUrl : `${assetUrl}${post.imageUrl}`;

  async function handleLike() {
    try {
      const response = await api.post<Post>(`/posts/${post.id}/like`);
      onUpdated?.(response.data);
    } catch {
      /* precisa login */
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <Text style={styles.username}>{post.author.username}</Text>
            {post.author.isVerified ? (
              <Text style={styles.badge}> ✓</Text>
            ) : null}
            <Text style={styles.dot}> · </Text>
            <Text style={styles.time}>{formatRelative(post.createdAt)}</Text>
          </View>
        </View>
        <Feather name="more-horizontal" size={20} color="#fff" />
      </View>

      <Image source={{ uri: imageSrc }} style={styles.image} resizeMode="cover" />

      <View style={styles.actions}>
        <Pressable onPress={handleLike} style={styles.actionBtn}>
          <Feather name="heart" size={26} color={post.likedByMe ? "#ff3040" : "#fff"} />
        </Pressable>
        <Pressable style={styles.actionBtn}>
          <Feather name="message-circle" size={26} color="#fff" />
        </Pressable>
        <Pressable style={styles.actionBtn}>
          <Feather name="send" size={24} color="#fff" />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable>
          <Feather name="bookmark" size={26} color="#fff" />
        </Pressable>
      </View>

      <Text style={styles.likes}>{post.likeCount.toLocaleString("pt-BR")} curtidas</Text>
      <Text style={styles.caption}>
        <Text style={styles.captionUser}>{post.author.username}</Text> {post.caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#262626",
    paddingBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  username: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  badge: {
    color: "#0095f6",
    fontSize: 14,
    fontWeight: "600",
  },
  dot: {
    color: "#a8a8a8",
    fontSize: 14,
  },
  time: {
    color: "#a8a8a8",
    fontSize: 14,
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 5,
    backgroundColor: "#121212",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingTop: 10,
    gap: 4,
  },
  actionBtn: {
    padding: 6,
  },
  likes: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    paddingHorizontal: 14,
    marginTop: 4,
  },
  caption: {
    color: "#fff",
    fontSize: 14,
    paddingHorizontal: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  captionUser: {
    fontWeight: "600",
  },
});
