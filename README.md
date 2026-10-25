# JamPacked

Your own music library, on your phone.

JamPacked is an Android player for [jamserve](https://github.com/ffalt/jamserve).
Point it at your server and the whole library is there to browse, play and take
offline. No subscription, no ads, your data, nothing phoning anywhere except your own server.

## What you can do

**Find things.** Browse by artist, album, folder, genre, series, playlist or
podcast. Long lists have an A-to-Z strip to jump with, and you can swipe between
a list and its favourites, recently played, most played, random and top-rated
views. Search covers everything at once, and a tap on any section opens the full
results for that kind.

**Play things.** Tap a track to select, tap again to play, or queue up whatever
you have selected. The queue is yours to shuffle, clear or prune. A mini player
follows you through the app; open it for the cover, the lyrics, and a waveform
you can scrub.

**Keep things.** Favourite and rate albums, artists and tracks, and keep
bookmarks. Plays are reported back to your server, so your listening history
stays with your library rather than with a third party.

**Take it offline.** Pin an album, a folder, a series or a single track, and it
downloads for keeps. Pinned music plays with no network at all, so a commute or
a flight is covered. A downloads screen shows what is in flight and lets you
pause it.

**Make it yours.** Four themes: follow the system, light, dark, or a true black
for OLED screens.

## What you need

A running [jamserve](https://github.com/ffalt/jamserve) instance and an account
on it. JamPacked is only a client; it does not scan or host music itself.

Android 7.0 or newer.

## Install

Grab the APK from the latest release and install it. Android will ask you to
allow installs from your browser or file manager the first time.

On first launch, enter your server URL, your username and your password. The
session is stored encrypted on the device, and the app keeps working offline
once it holds a token.

## Build it yourself

```bash
./gradlew :app:assembleDebug     # app/build/outputs/apk/debug/
./gradlew :app:installDebug      # straight onto a connected device
```

Linting

```bash
./gradlew lintDebug
./gradlew ktlintCheck
```

You will need the Android SDK and a JDK 17.
