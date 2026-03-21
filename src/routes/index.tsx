import { createFileRoute } from "@tanstack/solid-router";
import { Link } from "@tanstack/solid-router";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div class="flex h-full min-h-screen items-center justify-center">
      <Link to={"/player"} class="rounded-2xl bg-gray-400 px-20 py-10 text-2xl shadow">
        Go to player
      </Link>
      {/* TODO: collapsible of like what this is */}
    </div>
  );
}
