import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { useState } from "react";

import { ASSET_URL, api } from "../lib/api";
import type { ReelItem } from "../types";
import { clsx } from "clsx";

export function ReelsPage() {
  const queryClient = useQueryClient();
  const [index, setIndex] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reels"],
    queryFn: async () => {
      const response = await api.get<ReelItem[]>("/reels");
      return response.data;
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<ReelItem>(`/reels/${id}/like`);
      return response.data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<ReelItem[]>(["reels"], (current = []) =>
        current.map((r) => (r.id === updated.id ? updated : r)),
      );
    },
  });

  if (isLoading) {
    return <div className="py-20 text-center text-[#a8a8a8]">Carregando Reels…</div>;
  }

  if (isError || !data?.length) {
    return (
      <div className="py-20 text-center text-[#a8a8a8]">
        Nenhum reel disponível. Rode o seed no backend ou publique vídeos pela API.
      </div>
    );
  }

  const reel = data[Math.min(index, data.length - 1)];
  const avatar = reel.author.avatarUrl?.startsWith("http")
    ? reel.author.avatarUrl
    : reel.author.avatarUrl
      ? `${ASSET_URL}${reel.author.avatarUrl}`
      : `https://i.pravatar.cc/150?u=${reel.author.username}`;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center gap-4">
      <div className="relative aspect-[9/16] w-full max-w-[420px] overflow-hidden rounded-lg bg-black">
        <video
          key={reel.id}
          src={reel.videoUrl}
          className="h-full w-full object-cover"
          controls={false}
          playsInline
          autoPlay
          muted
          loop
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="pointer-events-auto flex items-center gap-3">
            <img src={avatar} alt="" className="size-10 rounded-full border border-white/20 object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">@{reel.author.username}</p>
              <p className="line-clamp-2 text-sm text-white/90">{reel.caption}</p>
            </div>
            <button
              type="button"
              className="rounded-md border border-white px-3 py-1 text-xs font-semibold text-white"
            >
              Seguir
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 py-8">
        <button
          type="button"
          onClick={() => likeMutation.mutate(reel.id)}
          className="flex flex-col items-center gap-1 text-white"
        >
          <Heart
            className={clsx("size-8", reel.likedByMe ? "fill-[#ff3040] text-[#ff3040]" : "")}
            strokeWidth={reel.likedByMe ? 0 : 1.5}
          />
          <span className="text-xs">{reel.likeCount.toLocaleString("pt-BR")}</span>
        </button>
        <button type="button" className="flex flex-col items-center gap-1 text-white">
          <MessageCircle className="size-8" strokeWidth={1.5} />
          <span className="text-xs">0</span>
        </button>
        <button type="button" className="text-white">
          <Send className="size-8" strokeWidth={1.5} />
        </button>
        <button type="button" className="text-white">
          <MoreHorizontal className="size-8" strokeWidth={1.5} />
        </button>
      </div>

      <div className="hidden flex-col gap-3 md:flex">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="rounded-full border border-white/20 p-3 text-white hover:bg-white/10"
          aria-label="Anterior"
        >
          <ChevronUp className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(data.length - 1, i + 1))}
          className="rounded-full border border-white/20 p-3 text-white hover:bg-white/10"
          aria-label="Próximo"
        >
          <ChevronDown className="size-5" />
        </button>
      </div>
    </div>
  );
}
