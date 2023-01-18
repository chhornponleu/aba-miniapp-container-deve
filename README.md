# Get Started
## Install

```bash
> cd /path/to/your/project
> yarn
> yarn start
```
Scan QR using Expo Go

## Supported

```
// 1. Set up
AbaPayway.miniApp({merchantName: "My Mini App Name"})

// 2. Get Profile
AbaPayway.miniAppGetProfile(function (response) {
    console.log(response)
})

```