// I don't think this works how i think it does.
export const userCache = new Map<string, string>();

import type { SpotifyApi } from "@spotify/web-api-ts-sdk";

/**
 * Fetches and caches the display name for a Spotify user.
 * @param sdk SpotifyApi instance
 * @param userId Spotify user ID
 * @returns display name or userId if not found
 */
export async function getUserDisplayName(sdk: SpotifyApi | undefined, userId: string): Promise<string> {
	if (!sdk) return userId;
	if (userCache.has(userId)) {
		return userCache.get(userId)!;
	}
	const user = await sdk.users.profile(userId);
	const name = user?.display_name ?? userId;
	userCache.set(userId, name);
	return name;
}
