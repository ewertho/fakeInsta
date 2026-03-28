import {
  Clapperboard,
  Compass,
  Heart,
  Home,
  Image as ImageIcon,
  MessageCircle,
  Search,
  SquarePlus,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../auth/auth-context";
import { ASSET_URL } from "../lib/api";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-4 rounded-lg px-3 py-2 text-sm transition ${
    isActive ? "font-bold text-white" : "font-normal text-white hover:bg-white/5"
  }`;

const iconWrap = "flex h-7 w-7 shrink-0 items-center justify-center";

export function Sidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="fixed bottom-0 left-0 top-0 z-30 flex w-[72px] flex-col border-r border-[#262626] bg-black py-4 md:w-[244px] md:px-3 md:py-8">
      <div className="mb-8 hidden px-3 md:block">
        <span className="text-2xl font-semibold tracking-tight text-white">FakeInsta</span>
      </div>
      <div className="mb-6 flex justify-center md:hidden">
        <ImageIcon className="size-7 text-white" strokeWidth={1.5} />
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        <NavLink to="/" end className={navClass}>
          <span className={iconWrap}>
            <Home className="size-[26px]" strokeWidth={1.75} />
          </span>
          <span className="hidden md:inline">Página inicial</span>
        </NavLink>

        <button
          type="button"
          className="flex items-center gap-4 rounded-lg px-3 py-2 text-sm font-normal text-white hover:bg-white/5"
        >
          <span className={iconWrap}>
            <Search className="size-[26px]" strokeWidth={1.5} />
          </span>
          <span className="hidden md:inline">Pesquisa</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-4 rounded-lg px-3 py-2 text-sm font-normal text-white hover:bg-white/5"
        >
          <span className={iconWrap}>
            <Compass className="size-[26px]" strokeWidth={1.5} />
          </span>
          <span className="hidden md:inline">Explorar</span>
        </button>

        <NavLink to="/reels" className={navClass}>
          <span className={iconWrap}>
            <Clapperboard className="size-[26px]" strokeWidth={1.5} />
          </span>
          <span className="hidden md:inline">Reels</span>
        </NavLink>

        <button
          type="button"
          className="relative flex items-center gap-4 rounded-lg px-3 py-2 text-sm font-normal text-white hover:bg-white/5"
        >
          <span className={iconWrap}>
            <MessageCircle className="size-[26px]" strokeWidth={1.5} />
          </span>
          <span className="absolute left-8 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff3040] px-1 text-[10px] font-bold text-white md:left-10">
            1
          </span>
          <span className="hidden md:inline">Mensagens</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-4 rounded-lg px-3 py-2 text-sm font-normal text-white hover:bg-white/5"
        >
          <span className={iconWrap}>
            <Heart className="size-[26px]" strokeWidth={1.5} />
          </span>
          <span className="hidden md:inline">Notificações</span>
        </button>

        <NavLink to="/new" className={navClass}>
          <span className={iconWrap}>
            <SquarePlus className="size-[26px]" strokeWidth={1.5} />
          </span>
          <span className="hidden md:inline">Criar</span>
        </NavLink>

        <NavLink to="/profile" className={navClass}>
          <span className={iconWrap}>
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl.startsWith("http") ? user.avatarUrl : `${ASSET_URL}${user.avatarUrl}`}
                alt=""
                className="size-7 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-7 items-center justify-center rounded-full bg-[#262626] text-xs text-white">
                ?
              </span>
            )}
          </span>
          <span className="hidden md:inline">Perfil</span>
        </NavLink>
      </nav>

      <div className="mt-auto space-y-2 border-t border-[#262626] pt-4">
        {user ? (
          <button
            type="button"
            onClick={() => signOut()}
            className="hidden w-full rounded-lg px-3 py-2 text-left text-sm text-[#a8a8a8] hover:bg-white/5 md:block"
          >
            Sair
          </button>
        ) : (
          <NavLink to="/login" className="hidden rounded-lg px-3 py-2 text-sm text-[#0095f6] md:block">
            Entrar
          </NavLink>
        )}
      </div>
    </aside>
  );
}
