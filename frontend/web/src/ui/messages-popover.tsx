import { ChevronDown, Minus, PenSquare, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { ASSET_URL, api } from "../lib/api";
import type { MessagePreview } from "../types";

export function MessagesPopover() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { data } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const response = await api.get<MessagePreview[]>("/messages");
      return response.data;
    },
    enabled: open,
    retry: false,
  });

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-[#262626] bg-[#262626] py-2 pl-3 pr-4 text-sm font-semibold text-white shadow-lg"
      >
        <span className="relative">
          Mensagens
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff3040] px-1 text-[10px]">
            1
          </span>
        </span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 flex flex-col overflow-hidden rounded-xl border border-[#262626] bg-[#121212] shadow-2xl transition-all ${
        expanded ? "h-[min(520px,80vh)] w-[min(400px,92vw)]" : "h-14 w-[min(320px,92vw)]"
      }`}
    >
      <div className="flex items-center justify-between border-b border-[#262626] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">Mensagens</span>
          <span className="rounded-full bg-[#ff3040] px-1.5 text-[10px] font-bold text-white">1</span>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setExpanded((e) => !e)} className="rounded p-1 text-white hover:bg-white/10">
            {expanded ? <Minus className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="rounded p-1 text-white hover:bg-white/10">
            <X className="size-4" />
          </button>
        </div>
      </div>

      {expanded ? (
        <div className="relative flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {data?.map((row) => {
              const avatar = row.other.avatarUrl?.startsWith("http")
                ? row.other.avatarUrl
                : row.other.avatarUrl
                  ? `${ASSET_URL}${row.other.avatarUrl}`
                  : `https://i.pravatar.cc/150?u=${row.other.username}`;

              return (
                <button
                  key={row.id}
                  type="button"
                  className="flex w-full items-center gap-3 border-b border-[#262626] px-3 py-3 text-left hover:bg-white/5"
                >
                  <img src={avatar} alt="" className="size-12 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{row.other.username}</p>
                    <p className="truncate text-xs text-[#a8a8a8]">{row.snippet}</p>
                  </div>
                  {row.unread ? <span className="size-2 rounded-full bg-[#0095f6]" /> : null}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="absolute bottom-4 right-4 rounded-full bg-[#0095f6] p-3 text-white shadow-lg"
            aria-label="Nova mensagem"
          >
            <PenSquare className="size-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
