import { app, BrowserWindow, dialog } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { spawn } from "child_process";
import { type ChildProcessWithoutNullStreams } from "node:child_process";
import fs from "node:fs";

let serverProcess: ChildProcessWithoutNullStreams | null = null;
let serverPort = 3000;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
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

  // In production, use the bundled backend
  if (process.env.NODE_ENV === "production") {
    // Determine backend path (different between development and packaged app)
    let backendPath: string;
    const resourcesPath = process.resourcesPath;
    const isDev = !app.isPackaged;
    
    if (isDev) {
      backendPath = path.resolve(path.join(__dirname, "../../../backend/dist/index.js"));
    } else {
      backendPath = path.join(resourcesPath, "backend/dist/index.js");
    }

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
        serverProcess = spawn("node", [backendPath], {
          shell: true,
          env: {
            ...process.env,
            PORT: serverPort.toString(),
          },
        });

        serverProcess.stdout.on("data", (data) => {
          console.log(`BACKEND: ${data}`);
        });
        
        serverProcess.stderr.on("data", (data) => {
          console.error(`BACKEND ERROR: ${data}`);
        });
        
        serverProcess.on("error", (err) => {
          console.error(`Failed to start backend process: ${err}`);
          dialog.showErrorBox(
            "Backend Error",
            `Failed to start backend process: ${err.message}`
          );
        });

        serverProcess.on("exit", (code) => {
          console.log(`Backend process exited with code ${code}`);
          if (code !== 0 && code !== null) {
            dialog.showErrorBox(
              "Backend Error",
              `Backend process exited with code ${code}`
            );
          }
        });
      } catch (error) {
        console.error("Failed to start backend:", error);
        dialog.showErrorBox(
          "Backend Error",
          `Failed to start backend: ${error}`
        );
      }
    }
  }

  // Old one for reference
  // Use uvicorn's --reload flag to enable auto-reload on code changes
  // serverProcess = spawn('uv', [
  //   'run',
  //   'uvicorn',
  //   '--reload', // <-- this enables auto-reload
  //   '--reload-dir', '../backend', // <-- specify the directory to watch
  //   '--app-dir=../backend',
  //   'main:app',
  //   '--host', '127.0.0.1',
  //   '--port', '8000'
  // ]);
};

app.commandLine.appendSwitch("enable-features", "Vulkan,WebGPU");

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("will-quit", () => {
  if (serverProcess) {
    try {
      // Attempt a graceful shutdown first
      serverProcess.kill("SIGTERM");
      
      // Force kill if still running after timeout
      setTimeout(() => {
        if (serverProcess) {
          console.log("Force killing backend process");
          serverProcess.kill("SIGKILL");
        }
      }, 2000);
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
