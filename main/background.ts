import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { spawn } from "child_process";
import { cwd } from "process";
import express from "express";

const isProd = process.env.NODE_ENV === "production";
console.log({ isProd });

const server = express();
server.use(express.static(path.join(cwd(), isProd ? ".." : "", "/app")));

server.listen(8000, "0.0.0.0", () => {
  console.log("EXPRESS SERVER ============================================");
});

process.chdir(path.join(cwd(), isProd ? ".." : "", "/backend"));
const nestServer = spawn("node", ["dist/src/main.js"]);

nestServer.stdout.on("data", (data) => {
  console.log(data.toString());
});

nestServer.stderr.on("data", (data) => {
  console.log(data.toString());
});

nestServer.stderr.on("error", (data) => {
  console.log(data.toString());
});

nestServer.on("error", (err) => {
  console.log(err);
});

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();
  const mainWindow = createWindow("main", {
    width: 1024,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./dashboard");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/dashboard`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

app.on("before-quit", (event) => {
  console.log(nestServer.kill(), "nestServer.kill()");
});

ipcMain.on("message", async (event, arg) => {
  event.reply("message", `${arg} World!`);
});
