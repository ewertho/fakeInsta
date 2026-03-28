import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { ASSET_URL, api } from "../lib/api";
import { useAuth } from "../auth/auth-context";
import type { ProfilePayload } from "../types";

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: me } = useAuth();
  const handle = username ?? me?.username;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile", handle],
    queryFn: async () => {
      const response = await api.get<ProfilePayload>(`/users/profile/${handle}`);
      return response.data;
    },
    enabled: Boolean(handle),
  });

  if (!handle) {
    return <p className="text-[#a8a8a8]">Faça login para ver seu perfil.</p>;
  }

  if (isLoading) {
    return <p className="text-[#a8a8a8]">Carregando…</p>;
  }

  if (isError || !data) {
    return <p className="text-[#ed4956]">Perfil não encontrado.</p>;
  }

  const avatar = data.avatarUrl?.startsWith("http")
    ? data.avatarUrl
    : data.avatarUrl
      ? `${ASSET_URL}${data.avatarUrl}`
      : `https://i.pravatar.cc/200?u=${data.username}`;

  return (
    <div>
      <header className="mb-8 flex flex-col gap-6 border-b border-[#262626] pb-8 md:flex-row md:items-center">
        <div className="story-ring mx-auto shrink-0 p-[3px] md:mx-0">
          <img src={avatar} alt="" className="size-24 rounded-full object-cover md:size-36" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-xl font-normal text-white md:text-2xl">{data.username}</h1>
          <div className="mt-4 flex justify-center gap-8 md:justify-start">
            <div>
              <span className="font-semibold text-white">{data._count.posts}</span>
              <p className="text-sm text-[#a8a8a8]">publicações</p>
            </div>
            <div>
              <span className="font-semibold text-white">{data._count.followers}</span>
              <p className="text-sm text-[#a8a8a8]">seguidores</p>
            </div>
            <div>
              <span className="font-semibold text-white">{data._count.following}</span>
              <p className="text-sm text-[#a8a8a8]">seguindo</p>
            </div>
          </div>
          <p className="mt-4 font-semibold text-white">{data.fullName}</p>
          {data.bio ? <p className="mt-1 text-sm text-white">{data.bio}</p> : null}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {data.posts.map((post) => (
          <button key={post.id} type="button" className="aspect-square overflow-hidden bg-[#121212]">
            <img
              src={post.imageUrl.startsWith("http") ? post.imageUrl : `${ASSET_URL}${post.imageUrl}`}
              alt=""
              className="size-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
