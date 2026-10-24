# Hottest 100 Player

Loosely inspired by this [video](https://www.facebook.com/watch/?v=2815707782030505), and plenty of others like it on social media,
I wanted to build a site that would emulate the countdown, such that I didn't have to keep track of the current number, and to give it a more authentic feel.

The spotify shuffle algorithm is also well documented to be biased by design (read more about that [here](https://archive.is/Da23I) and [here](https://engineering.atspotify.com/2025/11/shuffle-making-random-feel-more-human), and as such the shuffle was implemented to not use spotify's shuffle, and instead use a weighted shuffle, such that songs that are voted for more are more likely to be selected.

## Running Development Server

If you would like to work on this project, ensure you have pnpm installed.
then you can simply git clone the repository and then run the following.
You will need to set `VITE_CLIENT_ID` in your `.env` to be your spotify client id.
Note that you will need to add `http://127.0.0.1:5173/` to your spotify dashboard.

```bash
pnpm i
pnpm run dev
```
