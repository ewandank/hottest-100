import { createQuery } from "@tanstack/solid-query";
import { useNavigate } from "@tanstack/solid-router";
import LogOut from "lucide-solid/icons/log-out";

import { spotifyAPIQueryOptions } from "~/query/spotify-api";

export const LogoutButton = () => {
  const navigate = useNavigate();
  const spotifyQuery = createQuery(() => spotifyAPIQueryOptions);
  return (
    <button
      onClick={async () => {
        spotifyQuery.data?.logOut();
        await navigate({ to: "/" });
      }}
    >
      <LogOut />
    </button>
  );
};
