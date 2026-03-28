import { Heart, MapPin } from "lucide-react";

import { ASSET_URL, api } from "../lib/api";
import type { Post } from "../types";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  async function handleLike() {
    await api.post(`/posts/${post.id}/like`);
  }

  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-stone-900/80 shadow-xl shadow-black/30">
      <img
        src={`${ASSET_URL}${post.imageUrl}`}
        alt={post.description}
        className="h-80 w-full object-cover sm:h-[28rem]"
      />

      <div className="space-y-5 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-stone-50">{post.author}</h2>
            <div className="mt-1 inline-flex items-center gap-2 text-sm text-stone-300">
              <MapPin className="size-4 text-orange-300" />
              <span>{post.place || "Sem localização definida"}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLike}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-stone-100 transition hover:border-orange-300/30 hover:bg-orange-300/10"
          >
            <Heart className="size-4 text-orange-300" />
            Curtir
          </button>
        </div>

        <div className="flex items-center gap-3 text-sm text-stone-300">
          <span className="rounded-full bg-orange-300/10 px-3 py-1 text-orange-100">
            {post.likes} curtidas
          </span>
          <span>{new Date(post.createdAt).toLocaleString("pt-BR")}</span>
        </div>

        <div className="space-y-2">
          <p className="text-base leading-7 text-stone-100">{post.description}</p>
          {post.hashtags ? (
            <p className="text-sm font-medium text-orange-200">{post.hashtags}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
