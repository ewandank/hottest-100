import { createFileRoute } from "@tanstack/solid-router";
import { Link } from "@tanstack/solid-router";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div>
      <Link to={"/player"}>Get started</Link>
    </div>
  );
}
