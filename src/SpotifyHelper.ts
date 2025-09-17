import type { SpotifyApi } from "@spotify/web-api-ts-sdk";

const userCache = new Map<string, string>();

export async function getUserDisplayName(userId: string, spotify: () => SpotifyApi) {
  if (userCache.has(userId)) {
    return userCache.get(userId);
  }
  const user = await spotify()?.users.profile(userId)
  const name = user?.display_name ?? userId;
  userCache.set(userId, name);
  return name;
}