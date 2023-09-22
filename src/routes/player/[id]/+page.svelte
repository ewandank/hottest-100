<!--TODO: maybe yeet ssr, im still unsure if this would work with another client accessing it without login thanks to some weird cookie thing -->
<script>
    import { loadSpotifyPlayer } from "$lib/utils.js";
    import { onMount } from "svelte";
    export let data;
    let trackItems = data.trackItems;
    let currentTrack;
    function playNumber(src) {
        return new Promise((resolve, reject) => {
            const audio = new Audio(src);
            audio.onended = () => {
                resolve();
            };
            audio.onerror = (error) => {
                reject(error);
            };
            audio.play();
        });
    }
    function playTrack(device_id, uri) {
        fetch(`https://api.spotify.com/v1/me/player/play`, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " +data.accessToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                context_uri: uri,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Playback started successfully");
                } else {
                    console.error("Failed to start playback");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
    let player;
    let deviceId;
    async function playNext() {
        for (let i = 100; i > 99; i--) {
            const audioSrc = `/numbers/${i}.mp3`;
            try {
                await playNumber(audioSrc);
                currentTrack = trackItems[i - 1].track.name;
                let currentUri = trackItems[i - 1].track.uri;
                console.log(deviceId);
                playTrack(deviceId, currentUri);
            } catch (error) {
                console.error(`Error playing audio: ${error}`);
            }
        }
    }
    const initializePlayer = () => {
        // We need to wait before auth is initialized then we come here

        player = new window.Spotify.Player({
            getOAuthToken: async (cb) => {
                // This will run every time player.connect()
                // when user's token has expired.
                let token = "Bearer " + data.accessToken;
                cb(token);
            },
            name: "Hottest 100 player",
            volume: "0.5",
        });
        player.addListener("ready", ({ device_id }) => {
            console.log("Ready with Device ID", device_id);
            deviceId = device_id;
        });

        player.addListener("not_ready", ({ device_id }) => {
            console.log("Device ID has gone offline", device_id);
            deviceId = device_id;
        });

        // player.addListener("player_state_changed", handlePlayerStateChange);
        // player.addListener(
        //     "initialization_error",
        //     (error: WebPlaybackError) => {
        //         handlePlayerError("initialization_error", error.message);
        //     }
        // );
        // player.addListener(
        //     "authentication_error",
        //     (error: WebPlaybackError) => {
        //         handlePlayerError("authentication_error", error.message);
        //     }
        // );
        // player.addListener("playback_error", (error: WebPlaybackError) => {
        //     handlePlayerError("playback_error", error.message);
        // });
        // // Add player to Spotify Connect
        player.connect();
    };

    onMount(async () => {
        if (!window.onSpotifyWebPlaybackSDKReady) {
            window.onSpotifyWebPlaybackSDKReady = initializePlayer;
        } else {
            initializePlayer();
        }
        // Will this cause race conditions?
        await loadSpotifyPlayer();
    });
</script>

<button on:click|once={playNext}>SEND ITTTT</button>
{currentTrack}
