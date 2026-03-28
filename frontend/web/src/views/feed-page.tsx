import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "../lib/api";
import { socket } from "../lib/socket";
import type { Post } from "../types";
import { PostCard } from "../ui/post-card";

const postsQueryKey = ["posts"];

export function FeedPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
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

  if (isLoading) {
    return (
      <section className="grid gap-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-stone-200">
          Carregando publicações...
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-[2rem] border border-rose-400/20 bg-rose-400/10 p-8 text-rose-100">
        Não consegui carregar o feed. Confere se a API está rodando.
      </section>
    );
  }

  return (
    <section className="grid gap-6">
      <div className="rounded-[2rem] border border-orange-300/20 bg-gradient-to-r from-orange-300/15 to-amber-300/5 p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-orange-200/70">Feed em tempo real</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">
          Uma base nova, tipada e com atualizações ao vivo.
        </h2>
      </div>

      <div className="grid gap-6">
        {data?.length ? (
          data.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-8 text-stone-300">
            Ainda não há posts. Crie a primeira publicação para testar o fluxo completo.
          </div>
        )}
      </div>
    </section>
  );
}
