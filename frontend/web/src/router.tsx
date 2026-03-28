import { createBrowserRouter, Navigate } from "react-router-dom";

import { useAuth } from "./auth/auth-context";
import { AppLayout } from "./ui/app-layout";
import { CreatePostPage } from "./views/create-post-page";
import { FeedPage } from "./views/feed-page";
import { LoginPage } from "./views/login-page";
import { ProfilePage } from "./views/profile-page";
import { RegisterPage } from "./views/register-page";
import { ReelsPage } from "./views/reels-page";

function ProtectedCreate() {
  const { user, isReady } = useAuth();
  if (!isReady) {
    return <div className="p-8 text-center text-[#a8a8a8]">Carregando…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <CreatePostPage />;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <FeedPage />,
      },
      {
        path: "reels",
        element: <ReelsPage />,
      },
      {
        path: "new",
        element: <ProtectedCreate />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "profile/:username",
        element: <ProfilePage />,
      },
    ],
  },
]);
