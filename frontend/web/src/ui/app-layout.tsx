import { Outlet } from "react-router-dom";

import { useAuth } from "../auth/auth-context";
import { ASSET_URL } from "../lib/api";
import { MessagesPopover } from "./messages-popover";
import { Sidebar } from "./sidebar";
import { SuggestionsPanel } from "./suggestions-panel";

export function AppLayout() {
  const { user, isReady } = useAuth();

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-[#a8a8a8]">
        Carregando…
      </div>
    );
  }

  const avatar = user?.avatarUrl?.startsWith("http")
    ? user.avatarUrl
    : user?.avatarUrl
      ? `${ASSET_URL}${user.avatarUrl}`
      : user
        ? `https://i.pravatar.cc/150?u=${user.username}`
        : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />

      <div className="pl-[72px] md:pl-[244px]">
        <div className="mx-auto flex max-w-[935px] justify-center gap-8 xl:max-w-[1015px]">
          <main className="w-full max-w-[630px] shrink px-4 pb-24 pt-6 md:px-0">
            <Outlet />
          </main>

          <aside className="hidden w-[320px] shrink-0 py-6 xl:block">
            {user ? (
              <div className="mb-6 flex items-center gap-3">
                <img src={avatar ?? undefined} alt="" className="size-14 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{user.username}</p>
                  <p className="truncate text-sm text-[#a8a8a8]">{user.fullName}</p>
                </div>
                <button type="button" className="text-xs font-semibold text-[#0095f6]">
                  Mudar
                </button>
              </div>
            ) : (
              <p className="mb-6 text-sm text-[#a8a8a8]">
                <a href="/login" className="font-semibold text-[#0095f6]">
                  Entre
                </a>{" "}
                para ver sugestões e mensagens.
              </p>
            )}

            {user ? <SuggestionsPanel /> : null}

            <footer className="mt-8 text-xs leading-relaxed text-[#737373]">
              <p>
                Sobre · Ajuda · Imprensa · API · Empregos · Privacidade · Termos · Localizações · Idioma · Meta
                Verified
              </p>
              <p className="mt-4 uppercase">© {new Date().getFullYear()} FakeInsta</p>
            </footer>
          </aside>
        </div>
      </div>

      {user ? <MessagesPopover /> : null}
    </div>
  );
}
