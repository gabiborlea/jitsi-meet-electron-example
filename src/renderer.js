/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";

window.onload = () => {
  const api = new JitsiMeetExternalAPI("8x8.vc", {
    roomName:
      "vpaas-magic-cookie-43bfa39638d54e078798e2caff2d2010/test",
    parentNode: document.querySelector("#jaas-container")
  });
  api.on("_requestDesktopSources", async (request, callback) => {
    const { options } = request;

    window.jitsiAPI.getDesktopSources(options)
        .then(sources => callback({ sources }))
        .catch((error) => callback({ error }));
  });
};
