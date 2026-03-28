import { useCallback, useState } from "react";
import { Dimensions, FlatList, Image, ImageBackground, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { api, assetUrl } from "../lib/api";
import type { ReelItem } from "../types";

const { height: SCREEN_H } = Dimensions.get("window");

type ReelSlideProps = {
  item: ReelItem;
  onLike: () => void;
};

function ReelSlide({ item, onLike }: ReelSlideProps) {
  const avatar = item.author.avatarUrl?.startsWith("http")
    ? item.author.avatarUrl
    : item.author.avatarUrl
      ? `${assetUrl}${item.author.avatarUrl}`
      : `https://i.pravatar.cc/150?u=${item.author.username}`;

  const posterUri = `https://picsum.photos/seed/reel-${item.id}/720/1280`;

  async function openVideo() {
    const can = await Linking.canOpenURL(item.videoUrl);
    if (can) {
      await Linking.openURL(item.videoUrl);
    }
  }

  return (
    <View style={styles.slide}>
      <ImageBackground source={{ uri: posterUri }} style={styles.media} imageStyle={styles.mediaImage}>
        <Pressable style={styles.mediaTap} onPress={openVideo}>
          <View style={styles.playCircle}>
            <Feather name="play" size={40} color="#fff" style={{ marginLeft: 6 }} />
          </View>
          <Text style={styles.tapHint}>Toque para abrir o vídeo</Text>
        </Pressable>
      </ImageBackground>

      <View style={styles.rightBar}>
        <Pressable style={styles.sideBtn} onPress={onLike}>
          <Feather name="heart" size={32} color={item.likedByMe ? "#ff3040" : "#fff"} />
          <Text style={styles.sideCount}>{item.likeCount.toLocaleString("pt-BR")}</Text>
        </Pressable>
        <Pressable style={styles.sideBtn}>
          <Feather name="message-circle" size={30} color="#fff" />
        </Pressable>
        <Pressable style={styles.sideBtn}>
          <Feather name="send" size={28} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.bottomInfo}>
        <View style={styles.authorRow}>
          <Image source={{ uri: avatar }} style={styles.bottomAvatar} />
          <Text style={styles.bottomUser}>@{item.author.username}</Text>
          <Pressable style={styles.followBtn}>
            <Text style={styles.followText}>Seguir</Text>
          </Pressable>
        </View>
        <Text numberOfLines={2} style={styles.caption}>
          {item.caption}
        </Text>
      </View>
    </View>
  );
}

export function ReelsScreen() {
  const [reels, setReels] = useState<ReelItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      void (async () => {
        try {
          const response = await api.get<ReelItem[]>("/reels");
          if (mounted) setReels(response.data);
        } catch {
          if (mounted) setReels([]);
        }
      })();
      return () => {
        mounted = false;
      };
    }, []),
  );

  async function handleLike(id: string) {
    try {
      const response = await api.post<ReelItem>(`/reels/${id}/like`);
      setReels((current) => current.map((r) => (r.id === response.data.id ? response.data : r)));
    } catch {
      /* login */
    }
  }

  if (!reels.length) {
    return (
      <View style={[styles.slide, styles.centerMsg]}>
        <Text style={styles.msg}>Nenhum reel. Rode o seed no backend.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reels}
      keyExtractor={(item) => item.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={SCREEN_H}
      decelerationRate="fast"
      getItemLayout={(_, i) => ({
        length: SCREEN_H,
        offset: SCREEN_H * i,
        index: i,
      })}
      renderItem={({ item }) => <ReelSlide item={item} onLike={() => void handleLike(item.id)} />}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    height: SCREEN_H,
    width: "100%",
    backgroundColor: "#000",
  },
  media: {
    ...StyleSheet.absoluteFillObject,
  },
  mediaImage: {
    resizeMode: "cover",
  },
  mediaTap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  playCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  tapHint: {
    marginTop: 16,
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  rightBar: {
    position: "absolute",
    right: 12,
    bottom: 120,
    alignItems: "center",
    gap: 20,
  },
  sideBtn: {
    alignItems: "center",
    gap: 4,
  },
  sideCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  bottomInfo: {
    position: "absolute",
    left: 12,
    right: 72,
    bottom: 100,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  bottomAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#fff",
  },
  bottomUser: {
    flex: 1,
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  followBtn: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  followText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  caption: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
  centerMsg: {
    justifyContent: "center",
    alignItems: "center",
  },
  msg: {
    color: "#a8a8a8",
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
