# Steam Release Checklist

This document outlines the steps needed to prepare Confessional for Steam distribution.

## Current Build Status

✅ **Complete:**
- Electron Forge configuration optimized for Steam (no unnecessary installers)
- ASAR packaging enabled for code protection
- Backend bundled as extra resource
- Build scripts simplified for Steam workflow
- Electron Fuses configured for security

⚠️ **Needs Implementation:**

## Pre-Release Requirements

### 1. Steam Partner Account & App Setup
- [ ] Register as a Steam Partner (https://partner.steamgames.com)
- [ ] Create your app listing and get your **Steam App ID**
- [ ] Complete store page with screenshots, descriptions, pricing
- [ ] Set up payment and tax information

### 2. Steamworks SDK Integration

**Install Greenworks (recommended) or steamworks.js:**
```bash
cd apps/frontend
pnpm add greenworks
```

**Add Steam SDK files to project:**
```
apps/frontend/steam/
  ├── steam_api.dll          (Windows - 32/64 bit)
  ├── steam_api.lib          (Windows)
  ├── libsteam_api.dylib     (macOS)
  ├── libsteam_api.so        (Linux)
  └── steam_appid.txt        (Contains your Steam App ID)
```

**Update forge.config.ts to include Steam files:**
```typescript
packagerConfig: {
  extraResource: [
    '../backend/dist',
    './steam'  // Add this line
  ],
  // ... rest of config
}
```

**Initialize Steamworks in main.ts:**
```typescript
// At the top of main.ts
const greenworks = require('greenworks');

app.on('ready', () => {
  if (!greenworks.initAPI()) {
    console.error('Failed to initialize Steamworks API');
    app.quit();
    return;
  }
  console.log('Steamworks initialized successfully');
  // ... rest of your app initialization
});
```

### 3. Application Configuration

**Update package.json with Steam-appropriate metadata:**
- [ ] Set version to match your Steam build version
- [ ] Ensure `productName` is "Confessional"
- [ ] Update author/publisher info to match Steam developer account

**Create steam_appid.txt:**
- [ ] Create `apps/frontend/steam/steam_appid.txt`
- [ ] Add your Steam App ID as the only content (e.g., `480` for Spacewar test app)
- [ ] Use `480` for local testing before you have your real App ID

### 4. Code Signing (Critical for Production)

**Windows:**
- [ ] Obtain a code signing certificate (EV recommended)
- [ ] Configure electron-builder or use signtool.exe post-build
- [ ] Note: Steam can add DRM, but your base executable should be signed

**macOS (REQUIRED - Steam rejects unsigned Mac apps):**
- [ ] Enroll in Apple Developer Program ($99/year)
- [ ] Get Developer ID Application certificate
- [ ] Update forge.config.ts:
```typescript
osxSign: {
  identity: 'Developer ID Application: Your Name (TEAMID)',
  hardenedRuntime: true,
  entitlements: 'entitlements.plist',
  'entitlements-inherit': 'entitlements.plist',
},
osxNotarize: {
  appleId: process.env.APPLE_ID,
  appleIdPassword: process.env.APPLE_PASSWORD,
  teamId: process.env.APPLE_TEAM_ID,
}
```

**Linux:**
- [ ] No signing required, but test on Ubuntu/SteamOS

### 5. Steam Features Implementation

**Basic Integration:**
- [ ] Steam overlay support (verify it works)
- [ ] Steam authentication (verify user owns the game)
- [ ] Proper game closure handling (notify Steam when quitting)

**Optional but Recommended:**
- [ ] Steam Achievements
- [ ] Steam Cloud saves
- [ ] Steam leaderboards
- [ ] Steam Rich Presence (show what the player is doing)
- [ ] Steam Input (controller support)

### 6. Build for Steam

**Create Steam builds:**
```bash
# Windows build (on Windows machine or CI)
cd apps/frontend
npm run build:steam

# Output will be in: out/Confessional-win32-x64/

# macOS build (on macOS machine)
npm run build:steam

# Output will be in: out/Confessional-darwin-x64/
```

**Verify build contents:**
- [ ] Executable launches correctly
- [ ] All assets/resources are present
- [ ] Backend server starts properly
- [ ] Steam overlay appears (Shift+Tab)
- [ ] steam_appid.txt is in the root folder with your executable

### 7. Steam Build Upload

**Install Steamworks SDK tools:**
- [ ] Download from https://partner.steamgames.com
- [ ] Extract `tools/ContentBuilder`

**Create Steam depot configuration:**

Create `steam_build/app_build_[APPID].vdf`:
```
"AppBuild"
{
  "AppID" "YOUR_APP_ID"
  "Desc" "Confessional Build Description"
  "BuildOutput" "..\\output\\"
  "ContentRoot" "..\\content\\"
  "SetLive" "default"
  
  "Depots"
  {
    "YOUR_DEPOT_ID_WIN"
    {
      "FileMapping"
      {
        "LocalPath" "*"
        "DepotPath" "."
        "recursive" "1"
      }
      "FileExclusion" "*.pdb"
    }
  }
}
```

**Upload to Steam:**
```bash
steamcmd +login YOUR_STEAM_USERNAME +run_app_build "path/to/app_build_[APPID].vdf" +quit
```

### 8. Testing

**Before submitting for review:**
- [ ] Test with `steam_appid.txt` pointing to your real App ID
- [ ] Verify Steam overlay works
- [ ] Test achievements (if implemented)
- [ ] Test on clean machines (not your dev machine)
- [ ] Test on minimum spec hardware
- [ ] Verify no console windows appear in production build
- [ ] Check all game features work through Steam

**Steam beta testing:**
- [ ] Set up beta branches in Steamworks
- [ ] Invite beta testers
- [ ] Collect feedback and crash reports

### 9. Store Page & Release

- [ ] Complete all store page assets (screenshots, trailer, capsule images)
- [ ] Set pricing and regional pricing
- [ ] Write compelling description and feature list
- [ ] Add system requirements
- [ ] Set release date or "coming soon"
- [ ] Submit for Steam review
- [ ] Address any Valve feedback
- [ ] Publish!

## Build Commands Reference

```bash
# Local development
npm run dev

# Create packageable build (for Steam)
npm run build:steam

# Create ZIP for local testing
npm run make:zip

# Full build including backend
npm run build
```

## Helpful Resources

- [Steamworks Documentation](https://partner.steamgames.com/doc/home)
- [Greenworks GitHub](https://github.com/greenheartgames/greenworks)
- [Electron Forge Documentation](https://www.electronforge.io/)
- [Steam Launch Checklist](https://partner.steamgames.com/doc/store/release)

## Notes

- **Development Testing:** Use Steam App ID `480` (Spacewar) for local Steamworks testing
- **Steam Depot Structure:** Steam expects a flat folder with the executable and all dependencies
- **Updates:** Once on Steam, you can push updates through ContentBuilder - version your builds!
- **DRM:** Consider enabling Steam DRM wrapper on your executable (applied via Steamworks tools)
- **VAC:** If multiplayer, review whether VAC anti-cheat is appropriate for your game
