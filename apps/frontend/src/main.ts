import { app, BrowserWindow, dialog, UtilityProcess, utilityProcess } from "electron";
import path from "node:path";
import util from "node:util";
import fs from "node:fs";

// Create or append to log file in userData
const logPath = path.join(app.getPath('userData'), 'app.log');
const logStream = fs.createWriteStream(logPath, { flags: 'a' });

console.log = (...args) => {
  const message = util.format(...args);
  logStream.write(`[${new Date().toISOString()}] ${message}\n`);
  process.stdout.write(`${message}\n`);
};


let serverProcess: UtilityProcess | null = null;
// let serverProcess: ChildProcessWithoutNullStreams | null = null;
let serverPort = 3000;

const forkBackend = async (): Promise<UtilityProcess | null> => {
  if (!app.isPackaged) return null;

  return new Promise((resolve, reject) => {
    let proc: UtilityProcess | null = null;
    let backendPath: string;
    backendPath = path.join(process.resourcesPath, "dist/index.js");

    // Check if backend exists
    if (!fs.existsSync(backendPath)) {
      dialog.showErrorBox(
        "Backend Not Found",
        `Could not find the backend at ${backendPath}. The application may not function correctly.`
      );
      console.error(`Backend not found at path: ${backendPath}`);
    } else {
      // Start backend process
      try {
        proc = utilityProcess.fork(backendPath, [], {
          cwd: process.resourcesPath,
          stdio: 'inherit',
          env: {
            ...process.env,
            PORT: serverPort.toString(),
            ELECTRON_RUN_AS_NODE: "1",
          },
        });

        proc.stdout?.on("data", data => {
          console.log(`[BACKEND] ${data}`);
        });
        proc.stderr?.on("data", data => {
          console.log(`[BACKEND ERROR] ${data}`);
        });
        proc.on("error", (err, location, report) => {
          console.error(`Failed to start backend process: ${location}: ${report}`);
          dialog.showErrorBox(
            "Backend Error",
            `Failed to start backend process: ${location}: ${report}`
          );
        });
        proc.on("exit", (code) => {
          console.log(`Backend process exited with code ${code}`);
          if (code !== 0 && code !== null) {
            dialog.showErrorBox(
              "Backend Error",
              `Backend process exited with code ${code}`
            );
          }
        });

        proc.on("spawn", () => {
          console.log(`[BACKEND] Server ready!`);
          resolve(proc);
        });
      } catch (error) {
        const errMessage = error instanceof Error ? error.message : "";
        console.log(`Failed to start backend: ${errMessage}`);
        dialog.showErrorBox(
          "Backend Error",
          `Failed to start backend: ${error}`
        );
        reject(error);
      }
    }
  });
}

const createWindow = () => {
  if (BrowserWindow.getAllWindows().length > 0) return;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1800,
    height: 1200,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    const rendererPath = path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`);
    console.log(`Loading renderer from: ${rendererPath}`);
    mainWindow.loadFile(rendererPath);
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

app.commandLine.appendSwitch("enable-features", "Vulkan,WebGPU");

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  // In built app, use the bundled backend - for whatever reason the `app.isPackaged` check wasn't working here.
  serverProcess = await forkBackend();

  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// app.on("activate", () => {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });

app.on("will-quit", () => {
  if (serverProcess) {
    try {
      serverProcess.kill();
    } catch (error) {
      console.error("Error shutting down backend process:", error);
    }
  }
});

// Handle installation events on Windows
if (process.platform === 'win32') {
  const appFolder = path.dirname(process.execPath);
  const updateExe = path.resolve(appFolder, '..', 'Update.exe');
  const exeName = path.basename(process.execPath);

  app.setAppUserModelId('com.confessional.app');

  if (process.argv.includes('--squirrel-install') ||
    process.argv.includes('--squirrel-updated')) {
    // Optionally do things such as:
    // - Install desktop and start menu shortcuts
    // - Add your .exe to the PATH
    // - Write to the registry for things like file associations and
    //   explorer context menus
    app.quit();
  }
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
