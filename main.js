const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let isDev;

// Define the createWindow function
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

// Set up IPC event listener
ipcMain.on("toMain", (event, args) => {
  console.log(args); // logs out the sent message
  // Handle the message and respond back to the renderer process
  event.reply("fromMain", "Hello from the Main process!");
});

// Dynamically check if running in development mode
(async () => {
  if (process.env.NODE_ENV !== "production") {
    const electronIsDev = await import("electron-is-dev");
    isDev = electronIsDev.default;
  } else {
    isDev = false;
  }

  // When Electron is ready, create the window
  app.whenReady().then(createWindow);

  // Quit when all windows are closed, except on macOS
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  // On macOS, re-create a window in the app when the dock icon is clicked and there are no other windows open
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
})();
