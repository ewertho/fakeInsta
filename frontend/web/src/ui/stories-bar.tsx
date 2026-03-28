import { ChevronRight } from "lucide-react";

import { ASSET_URL } from "../lib/api";
import type { StoryItem } from "../types";

type StoriesBarProps = {
  stories: StoryItem[];
};

export function StoriesBar({ stories }: StoriesBarProps) {
  if (!stories.length) {
    return null;
  }

  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg border border-[#262626] bg-black px-2 py-4">
      <div className="scrollbar-hide flex flex-1 gap-4 overflow-x-auto pb-1">
        {stories.map((story) => {
          const avatar = story.user.avatarUrl?.startsWith("http")
            ? story.user.avatarUrl
            : story.user.avatarUrl
              ? `${ASSET_URL}${story.user.avatarUrl}`
              : `https://i.pravatar.cc/150?u=${story.user.username}`;

          return (
            <button
              key={story.id}
              type="button"
              className="flex w-[72px] shrink-0 flex-col items-center gap-1"
            >
              <div className="story-ring p-[2px]">
                <img src={avatar} alt="" className="size-14 rounded-full object-cover" />
              </div>
              <span className="w-full truncate text-center text-xs text-white">
                {story.user.username.length > 12 ? `${story.user.username.slice(0, 10)}…` : story.user.username}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="hidden shrink-0 rounded-full border border-white/20 p-2 text-white md:flex"
        aria-label="Próximo"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
