# Hottest 100 Player

Loosely inspired by this [video](https://www.facebook.com/watch/?v=2815707782030505), and plenty of others like it on social media,
I wanted to build a site that would emulate the countdown, such that I didn't have to keep track of the current number, and to give it a more authentic feel.

The spotify shuffle algorithm is also well documented to be biased by design (read more about that [here](https://engineering.atspotify.com/2014/02/how-to-shuffle-songs/)), and as such the shuffle was implemented to not use spotify's shuffle, to make it closer to random.

## Known Bugs

- The login button must be pressed again after initially authorizing use. This appears to be a bug with svelte library I am using.
- This player does not work on iOS, and appears to be a limitation of mobile safari and background play.

## Features that I would like to implement

Below is a list of features that I would like to implement in the future.

- Allow User to logout (i.e delete their cookies)
- Show statistics of the countdown once it is complete (% Australian, Artists Who received X number of songs in the countdown etc..)

## Running Development Server

If you would like to work on this project, ensure you have pnpm installed.
then you can simply git clone the repository and then run the following.
Note that you will need to add `http://localhost:5173/` to your spotify dashboard.

```bash
pnpm i
pnpm run dev
```
