import { Outlet, createRootRouteWithContext } from "@tanstack/solid-router";

export const Route = createRootRouteWithContext()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
