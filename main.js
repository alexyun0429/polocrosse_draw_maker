const { app, BrowserWindow } = require("electron");
const path = require("path");

// Dynamically import electron-is-dev because it uses ES Module syntax
let isDev;

(async () => {
  // Dynamically check if running in development mode
  if (process.env.NODE_ENV !== "production") {
    const electronIsDev = await import("electron-is-dev");
    isDev = electronIsDev.default;
  } else {
    isDev = false;
  }

  function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    // Load app
    const appURL = isDev
      ? "http://localhost:3000" // React dev server URL
      : `file://${path.join(
          __dirname,
          "polocrosse-draw-maker/build/index.html"
        )}`; // Path to React build directory
    win.loadURL(appURL);

    // Open the DevTools automatically if in development mode
    if (isDev) {
      win.webContents.openDevTools();
    }
  }

  app.whenReady().then(createWindow);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
})();

// If you have additional IPC or other backend logic, it can go here or inside the async function as needed.
