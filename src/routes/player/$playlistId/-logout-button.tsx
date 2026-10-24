import { createQuery } from "@tanstack/solid-query";
import { useNavigate } from "@tanstack/solid-router";
import LogOut from "lucide-solid/icons/log-out";

import { spotifyAPIQueryOptions } from "~/query/spotify-api";
import { queryClient } from "~/queryClient";

export const LogoutButton = () => {
  const navigate = useNavigate();
  const spotifyQuery = createQuery(() => spotifyAPIQueryOptions);
  return (
    <button
      onClick={async () => {
        if (!window.confirm("Are you sure you want to log out?")) {
          return;
        }

        spotifyQuery.data?.logOut();
        queryClient.clear();
        await navigate({ to: "/" });
      }}
    >
      <LogOut />
    </button>
  );
};
