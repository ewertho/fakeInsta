import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ASSET_URL, api } from "../lib/api";
import type { SuggestionUser } from "../types";

export function SuggestionsPanel() {
  const queryClient = useQueryClient();
  const { data, isError } = useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => {
      const response = await api.get<SuggestionUser[]>("/users/suggestions");
      return response.data;
    },
    retry: false,
  });

  const followMutation = useMutation({
    mutationFn: async (userId: string) => {
      await api.post(`/users/${userId}/follow`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });

  if (isError || !data?.length) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#a8a8a8]">Sugestões para você</span>
        <button type="button" className="text-xs font-semibold text-white">
          Ver tudo
        </button>
      </div>
      <ul className="space-y-3">
        {data.map((user) => {
          const avatar = user.avatarUrl?.startsWith("http")
            ? user.avatarUrl
            : user.avatarUrl
              ? `${ASSET_URL}${user.avatarUrl}`
              : `https://i.pravatar.cc/150?u=${user.username}`;

          return (
            <li key={user.id} className="flex items-center gap-3">
              <img src={avatar} alt="" className="size-9 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{user.username}</p>
                <p className="truncate text-xs text-[#a8a8a8]">
                  {user.followedByUsername
                    ? `Seguido(a) por ${user.followedByUsername}`
                    : "Sugestão para você"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => followMutation.mutate(user.id)}
                disabled={followMutation.isPending}
                className="shrink-0 text-xs font-semibold text-[#0095f6] hover:text-white disabled:opacity-50"
              >
                Seguir
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
