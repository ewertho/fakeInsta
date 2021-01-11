import { useEffect, useState } from "react";
import "./Feed.css";
import more from "../assets/more.svg";
import like from "../assets/like.svg";
import comment from "../assets/comment.svg";
import send from "../assets/send.svg";
import api from "../services/Api";
import io from "socket.io-client";

function Feed() {
  const [feed, setFeed] = useState([]);

  const socket = io("http://localhost:3333");

  useEffect(() => {
    async function load() {
      const response = await api.get("/lock/posts");
      setFeed(response.data);
    }
    load();
  }, []);

  useEffect(() => {
    if (feed) registerToSocket(feed);
  }, [socket]);

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
    api.post(`/posts/${id}/like`);
  }

  return (
    <section id="post-list">
      {feed.map((post) => (
        <article key={post._id}>
          <header>
            <div className="user-info">
              <span>{post.author}</span>
              <span className="place">{post.place}</span>
            </div>
            <img src={more} alt="" />
          </header>
          <img src={`http://localhost:3333/files/${post.image}`} alt="" />
          <footer>
            <div className="actions">
              <button onClick={() => handleLike(post._id)}>
                <img src={like} alt="" />
              </button>
              <img src={comment} alt="" />
              <img src={send} alt="" />
            </div>
            <strong>{post.likes}</strong>
            <p>
              {post.description}
              <span>{post.hashtags}</span>
            </p>
          </footer>
        </article>
      ))}
    </section>
  );
}

export default Feed;
