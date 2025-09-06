import { createFileRoute } from "@tanstack/solid-router";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { Suspense, createResource } from "solid-js";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

let sdk: SpotifyApi | undefined;
// (
//   import.meta.env.VITE_PUBLIC_CLIENT_ID,
//   window.location.href,
//   [
//     "playlist-read-private",
//     "user-modify-playback-state",
//     "streaming",
//     "user-read-email",
//     "user-read-private",
//   ],
//   window.location.href
// );

const handler = () => {
  sdk = SpotifyApi.performUserAuthorization(
    import.meta.env.VITE_PUBLIC_CLIENT_ID,
    window.location.href,
    [
      "playlist-read-private",
      "user-modify-playback-state",
      "streaming",
      "user-read-email",
      "user-read-private",
    ],
    window.location.href,
  );
};

const [search] = createResource(() => sdk?.search("beatles", ["artist"]));
function IndexComponent() {
  return (
    <div class="flex items-center justify-center bg-gray-500 h-screen w-full">
      <button class="w-50 text-2xl bg-pink-600">Log in?</button>
      <Suspense>{search()?.artists.items[0].name}</Suspense>
    </div>
  );
}
