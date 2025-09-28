import { createFileRoute } from "@tanstack/solid-router";
import { Link } from "@tanstack/solid-router";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div class="h-full min-h-screen flex justify-center items-center">
      <Link
        to={"/player"}
        class="bg-gray-400 text-2xl py-10 px-20 rounded-2xl shadow"
      >
        Go to player
      </Link>
      {/* TODO: collapsible of like what this is */}
    </div>
  );
}
