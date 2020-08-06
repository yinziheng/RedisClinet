import { app, BrowserWindow ,ipcMain} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1200, height: 800, frame: false, transparent: false, webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


//窗口最小化
ipcMain.on('min', function () {
  mainWindow.minimize();
})

//窗口最大化
let isMax = false;
ipcMain.on('max', function () {
  if (isMax) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
  isMax = !isMax
})

//窗口关闭
ipcMain.on('close', function () {
  mainWindow.close();
})