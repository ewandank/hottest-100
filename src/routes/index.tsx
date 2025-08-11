import { createFileRoute } from "@tanstack/solid-router";
import { SpotifyWebApi } from '@spotify/web-api-ts-sdk';

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div class="flex items-center justify-center bg-gray-500 h-screen w-full">
        <button class="w-50 text-2xl bg-pink-600">Log in?</button>
    </div>
  );
}
