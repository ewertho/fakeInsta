import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import api from "../services/Api";
import io from "socket.io-client";

import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import more from "../assets/more.png";

function Feed({ navigation }) {
  const [like, setLike] = useState(false);
  const [feed, setFeed] = useState([]);

  const socket = io("http://192.168.1.5:3333");

  useEffect(() => {
    async function load() {
      const response = await api.get("/posts");
      setFeed(response.data);
    }
    load();
  }, []);

  useEffect(() => {
    if (feed) registerToSocket(feed);
  }, [socket, navigation]);

  function registerToSocket(feed) {
    socket.on("post", (newPost) => {
      setFeed([newPost, ...feed]);
    });

    socket.on("like", (likedPost) => {
      setFeed(
        feed.map((post) => (post._id === likedPost._id ? likedPost : post))
      );
    });
  }

  function handleLike(id) {
    setLike(!like);
    api.post(`/posts/${id}/like`);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={feed}
        keyExtractor={(post) => post._id}
        renderItem={({ item }) => (
          <View style={styles.feedItem}>
            <View style={styles.feedItemHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.name}>{item.author}</Text>
                <Text style={styles.place}>{item.place}</Text>
              </View>
              <MaterialIcons name="more-horiz" size={24} color="black" />
            </View>
            <Image
              style={styles.feedImage}
              source={{ uri: `http://192.168.1.5:3333/files/${item.image}` }}
            />
            <View style={styles.feedItemFooter}>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.action} onPress={handleLike}>
                  <Entypo name="emoji-neutral" size={22} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.action} onPress={() => {}}>
                  <FontAwesome name="comments-o" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.action} onPress={() => {}}>
                  <MaterialCommunityIcons
                    name="email-send-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.likes}>
                {item.likes ? item.likes : "Nenhuma"} curtidas
              </Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.hashtags}>{item.hashtags}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: "#666",
  },
  feedItem: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingVertical: 15,
  },
  feedItemHeader: {
    paddingHorizontal: 15,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 14,
    color: "#000",
  },
  place: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  feedImage: {
    width: "100%",
    height: 400,
    marginVertical: 15,
  },
  feedItemFooter: {
    paddingHorizontal: 15,
  },
  actions: {
    flexDirection: "row",
  },
  action: {
    marginRight: 8,
  },
  likes: {
    marginTop: 15,
    fontWeight: "bold",
    color: "#000",
  },
  description: {
    lineHeight: 18,
    color: "#000",
  },
  hashtags: {
    color: "#7159",
  },
});

export default Feed;
