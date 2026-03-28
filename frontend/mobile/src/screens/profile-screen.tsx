import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { api, assetUrl } from "../lib/api";
import { useAuth } from "../lib/auth-context";
import type { ProfilePayload } from "../types";

export function ProfileScreen() {
  const { user: me } = useAuth();
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!me?.username) {
        setLoading(false);
        return;
      }

      let mounted = true;
      void (async () => {
        try {
          const response = await api.get<ProfilePayload>(`/users/profile/${me.username}`);
          if (mounted) setProfile(response.data);
        } catch {
          if (mounted) setProfile(null);
        } finally {
          if (mounted) setLoading(false);
        }
      })();

      return () => {
        mounted = false;
      };
    }, [me?.username]),
  );

  if (!me) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Faça login.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Perfil não encontrado.</Text>
      </View>
    );
  }

  const avatar = profile.avatarUrl?.startsWith("http")
    ? profile.avatarUrl
    : profile.avatarUrl
      ? `${assetUrl}${profile.avatarUrl}`
      : `https://i.pravatar.cc/200?u=${profile.username}`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.ring}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </View>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{profile._count.posts}</Text>
            <Text style={styles.statLabel}>publicações</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{profile._count.followers}</Text>
            <Text style={styles.statLabel}>seguidores</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{profile._count.following}</Text>
            <Text style={styles.statLabel}>seguindo</Text>
          </View>
        </View>
      </View>
      <Text style={styles.name}>{profile.fullName}</Text>
      {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}

      <View style={styles.grid}>
        {profile.posts.map((post) => (
          <View key={post.id} style={styles.cell}>
            <Image
              source={{
                uri: post.imageUrl.startsWith("http") ? post.imageUrl : `${assetUrl}${post.imageUrl}`,
              }}
              style={styles.thumb}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  muted: {
    color: "#a8a8a8",
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 24,
    alignItems: "center",
  },
  ring: {
    borderRadius: 999,
    padding: 3,
    backgroundColor: "#e6683c",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: "#000",
  },
  stats: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
  },
  statNum: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  statLabel: {
    color: "#a8a8a8",
    fontSize: 13,
    marginTop: 2,
  },
  name: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  bio: {
    color: "#fff",
    fontSize: 14,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },
  cell: {
    width: "33.33%",
    aspectRatio: 1,
    padding: 1,
  },
  thumb: {
    flex: 1,
    backgroundColor: "#121212",
  },
});
