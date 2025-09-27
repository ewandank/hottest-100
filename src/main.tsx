import { RouterProvider, createRouter } from "@tanstack/solid-router";
import { render } from "solid-js/web";

import { routeTree } from "./routeTree.gen";
import "./styles.css";
import { GlobalStateProvider } from "./context/context";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/solid-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <>
      <GlobalStateProvider>
        <RouterProvider router={router} />
      </GlobalStateProvider>
    </>
  );
}

const rootElement = document.getElementById("app");
if (rootElement) {
  render(() => <App />, rootElement);
}
