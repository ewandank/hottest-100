import { Outlet, createRootRouteWithContext } from "@tanstack/solid-router";

export const Route = createRootRouteWithContext()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div class="bg-jjj-gradient flex h-screen flex-col overflow-hidden">
      <div class="mx-auto flex min-h-0 w-4/5 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
}
