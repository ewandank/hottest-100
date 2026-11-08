import { getRouteApi } from "@tanstack/solid-router";

const playerRoute = getRouteApi("/player");

export const createSpotifyApi = () => {
  const context = playerRoute.useRouteContext();
  return context().sdk;
};
