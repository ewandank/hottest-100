import { useNavigate } from "@tanstack/solid-router";
import LogOut from "lucide-solid/icons/log-out";

import { queryClient } from "~/queryClient";

import { createSpotifyApi } from "../-create-spotify";

export const LogoutButton = () => {
  const navigate = useNavigate();
  const spotify = createSpotifyApi();
  return (
    <button
      onClick={async () => {
        if (!window.confirm("Are you sure you want to log out?")) {
          return;
        }

        spotify.logOut();
        queryClient.clear();
        await navigate({ to: "/" });
      }}
    >
      <LogOut />
    </button>
  );
};
