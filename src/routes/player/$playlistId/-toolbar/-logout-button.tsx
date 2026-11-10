import { useNavigate } from "@tanstack/solid-router";
import LogOut from "lucide-solid/icons/log-out";

import { queryClient } from "~/queryClient";
import { createSpotifyApi } from "~/routes/player/-create-spotify";

export const LogoutButton = () => {
  const navigate = useNavigate();
  const spotify = createSpotifyApi();
  return (
    <button
      onClick={async () => {
        if (!window.confirm("Are you sure you want to log out?")) {
          return;
        }
        if (!window.confirm("Are you really sure? This will destroy your current countdown!")) {
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
