# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

Pinned to SDK 54 (not the newest SDK) on purpose: the public App Store build
of Expo Go only supports the latest SDK it ships with, and lags behind new
Expo SDK releases — testing newer SDKs there requires a custom `eas go` /
EAS Build development client. Don't bump past SDK 54 without checking what
Expo Go currently supports, or the app will fail to load with "Project is
incompatible with this version of Expo Go".
