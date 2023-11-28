const {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  systemPreferences,
} = require("electron");
const { SCREEN_SHARE_GET_SOURCES } = require("./constants");
const { exec } = require("child_process");
const path = require("path");
const pkgJson = require("../package.json");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  const hasPermission =
    systemPreferences.getMediaAccessStatus("screen") === "granted";
  if (!hasPermission) {
    exec("tccutil reset ScreenCapture " + pkgJson.build.appId);
  }

  ipcMain.handle(SCREEN_SHARE_GET_SOURCES, (_event, options) =>
    desktopCapturer.getSources(options).then((sources) => {
      return sources.map(item => {
        return {
          ...item,
          thumbnail: {
            dataUrl: item.thumbnail.toDataURL()
          }
        }
      });
    })
  );
};

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
  ipcMain.removeHandler(SCREEN_SHARE_GET_SOURCES);
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
