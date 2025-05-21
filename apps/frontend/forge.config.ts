import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    extraResource: ['../backend/dist', "../../node_modules"],
    icon: './assets/icon',
    appBundleId: 'com.confessional.app',
    // Only sign when APPLE_IDENTITY is explicitly provided
    osxSign: process.env.APPLE_IDENTITY ? {
      identity: process.env.APPLE_IDENTITY,
      // hardenedRuntime: true,
      // entitlements: 'entitlements.plist',
      // 'entitlements-inherit': 'entitlements.plist',
      // 'signature-flags': 'library'
    } : undefined,
    // For notarization (optional)
    // osxNotarize: process.env.APPLE_ID && process.env.APPLE_PASSWORD ? {
    //   appleId: process.env.APPLE_ID,
    //   appleIdPassword: process.env.APPLE_PASSWORD,
    //   teamId: process.env.APPLE_TEAM_ID,
    // } : undefined,
  },
  rebuildConfig: {
    onlyModules: ['@dimforge/rapier3d-compat'],
  },
  makers: [
    new MakerSquirrel({
      name: 'Confessional',
      authors: 'Confessional Team',
      setupIcon: './assets/icon.ico',
      iconUrl: 'https://raw.githubusercontent.com/your-org/confessional/main/apps/frontend/assets/icon.ico',
    }),
    new MakerZIP({}, ['darwin', 'linux']),
    new MakerRpm({
      options: {
        name: 'confessional',
        productName: 'Confessional',
        icon: './assets/icon.png',
        bin: 'Confessional'
      }
    }),
    new MakerDeb({
      options: {
        name: 'confessional',
        productName: 'Confessional',
        icon: './assets/icon.png',
        bin: 'Confessional'
      }
    })
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
