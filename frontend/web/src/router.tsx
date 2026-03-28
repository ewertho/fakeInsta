import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "./ui/app-layout";
import { CreatePostPage } from "./views/create-post-page";
import { FeedPage } from "./views/feed-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <FeedPage />,
      },
      {
        path: "new",
        element: <CreatePostPage />,
      },
    ],
  },
]);
