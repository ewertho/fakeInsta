import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "../lib/api";
import { socket } from "../lib/socket";
import type { Post, StoryItem } from "../types";
import { PostCard } from "../ui/post-card";
import { StoriesBar } from "../ui/stories-bar";

const postsQueryKey = ["posts"];

export function FeedPage() {
  const queryClient = useQueryClient();

  const storiesQuery = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const response = await api.get<StoryItem[]>("/stories");
      return response.data;
    },
  });

  const postsQuery = useQuery({
    queryKey: postsQueryKey,
    queryFn: async () => {
      const response = await api.get<Post[]>("/posts");
      return response.data;
    },
  });

  useEffect(() => {
    function handlePostCreated(newPost: Post) {
      queryClient.setQueryData<Post[]>(postsQueryKey, (current = []) => [newPost, ...current]);
    }

    function handlePostLiked(updatedPost: Post) {
      queryClient.setQueryData<Post[]>(postsQueryKey, (current = []) =>
        current.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
      );
    }

    socket.on("post:created", handlePostCreated);
    socket.on("post:liked", handlePostLiked);

    return () => {
      socket.off("post:created", handlePostCreated);
      socket.off("post:liked", handlePostLiked);
    };
  }, [queryClient]);

  if (postsQuery.isLoading) {
    return (
      <div className="rounded-lg border border-[#262626] bg-black p-8 text-center text-[#a8a8a8]">
        Carregando feed…
      </div>
    );
  }

  if (postsQuery.isError) {
    return (
      <div className="rounded-lg border border-[#ed4956]/30 bg-[#ed4956]/10 p-8 text-center text-[#ed4956]">
        Não foi possível carregar o feed. Verifique se a API está em execução.
      </div>
    );
  }

  return (
    <section>
      {storiesQuery.data?.length ? <StoriesBar stories={storiesQuery.data} /> : null}

      <div className="space-y-2">
        {postsQuery.data?.length ? (
          postsQuery.data.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLiked={(updated) => {
                queryClient.setQueryData<Post[]>(postsQueryKey, (current = []) =>
                  current.map((p) => (p.id === updated.id ? updated : p)),
                );
              }}
            />
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-[#262626] p-10 text-center text-[#a8a8a8]">
            Nenhuma publicação ainda. Crie a primeira em <span className="text-white">Criar</span>.
          </div>
        )}
      </div>
    </section>
  );
}
