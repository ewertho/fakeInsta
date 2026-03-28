import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { useState } from "react";

import { ASSET_URL, api } from "../lib/api";
import type { Post } from "../types";
import { clsx } from "clsx";

type PostCardProps = {
  post: Post;
  onLiked?: (post: Post) => void;
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

export function PostCard({ post, onLiked }: PostCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [saving, setSaving] = useState(false);

  const avatar = post.author.avatarUrl?.startsWith("http")
    ? post.author.avatarUrl
    : post.author.avatarUrl
      ? `${ASSET_URL}${post.author.avatarUrl}`
      : `https://i.pravatar.cc/150?u=${post.author.username}`;

  const imageSrc = post.imageUrl.startsWith("http") ? post.imageUrl : `${ASSET_URL}${post.imageUrl}`;

  async function handleLike() {
    try {
      const response = await api.post<Post>(`/posts/${post.id}/like`);
      setLiked(response.data.likedByMe);
      setLikeCount(response.data.likeCount);
      onLiked?.(response.data);
    } catch {
      /* precisa login */
    }
  }

  return (
    <article className="mb-4 border-b border-[#262626] bg-black pb-6 last:border-0">
      <header className="mb-3 flex items-center justify-between gap-2 px-1">
        <div className="flex min-w-0 items-center gap-3">
          <div className="story-ring shrink-0 p-[2px]">
            <img src={avatar} alt="" className="size-8 rounded-full object-cover" />
          </div>
          <div className="flex min-w-0 items-center gap-1 text-sm">
            <span className="truncate font-semibold text-white">{post.author.username}</span>
            {post.author.isVerified ? (
              <span className="text-[#0095f6]" aria-label="Verificado">
                ✓
              </span>
            ) : null}
            <span className="text-[#a8a8a8]">·</span>
            <span className="shrink-0 text-[#a8a8a8]">{formatRelative(post.createdAt)}</span>
          </div>
        </div>
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setMenuOpen(true)}
          className="rounded-full p-1 text-white hover:bg-white/10"
        >
          <MoreHorizontal className="size-5" />
        </button>
      </header>

      <div className="overflow-hidden rounded-sm border border-[#262626] bg-black">
        <img src={imageSrc} alt="" className="aspect-[4/5] w-full object-cover sm:aspect-auto sm:max-h-[600px]" />
      </div>

      <div className="mt-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <button type="button" onClick={handleLike} aria-label="Curtir" className="text-white">
            <Heart
              className={clsx("size-6", liked ? "fill-[#ff3040] text-[#ff3040]" : "")}
              strokeWidth={liked ? 0 : 1.75}
            />
          </button>
          <button type="button" aria-label="Comentar" className="text-white">
            <MessageCircle className="size-6" strokeWidth={1.75} />
          </button>
          <button type="button" aria-label="Enviar" className="text-white">
            <Send className="size-6" strokeWidth={1.75} />
          </button>
        </div>
        <button
          type="button"
          aria-label="Salvar"
          onClick={() => setSaving((s) => !s)}
          className="text-white"
        >
          <Bookmark className={clsx("size-6", saving ? "fill-white" : "")} strokeWidth={1.75} />
        </button>
      </div>

      <p className="mt-2 px-1 text-sm font-semibold text-white">{likeCount.toLocaleString("pt-BR")} curtidas</p>

      <div className="mt-1 px-1 text-sm text-white">
        <span className="font-semibold">{post.author.username}</span>{" "}
        <span className="font-normal">{post.caption}</span>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog">
          <button type="button" className="absolute inset-0 cursor-default" onClick={() => setMenuOpen(false)} />
          <div className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-xl bg-[#262626] text-center text-sm">
            <button type="button" className="w-full py-3.5 font-normal text-[#ed4956] hover:bg-white/5">
              Denunciar
            </button>
            <div className="h-px bg-[#3c3c3c]" />
            <button type="button" className="w-full py-3.5 font-normal text-[#ed4956] hover:bg-white/5">
              Deixar de seguir
            </button>
            <div className="h-px bg-[#3c3c3c]" />
            <button type="button" className="w-full py-3.5 text-white hover:bg-white/5">
              Adicionar aos favoritos
            </button>
            <div className="h-px bg-[#3c3c3c]" />
            <button type="button" className="w-full py-3.5 text-white hover:bg-white/5">
              Ir para a publicação
            </button>
            <div className="h-px bg-[#3c3c3c]" />
            <button type="button" className="w-full py-3.5 text-white hover:bg-white/5">
              Copiar link
            </button>
            <div className="h-px bg-[#3c3c3c]" />
            <button type="button" className="w-full py-3.5 text-white hover:bg-white/5">
              Incorporar
            </button>
            <div className="h-px bg-[#3c3c3c]" />
            <button type="button" className="w-full py-3.5 text-white hover:bg-white/5">
              Sobre esta conta
            </button>
            <div className="h-px bg-[#3c3c3c]" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="w-full py-3.5 font-normal text-white hover:bg-white/5"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}
