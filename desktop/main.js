const { app, BrowserWindow } = require("electron");
const http = require("http");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4"
};

function criarServidorLocal() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, "http://127.0.0.1");
      const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
      const requestedPath = path.normalize(path.join(projectRoot, pathname));

      if (!requestedPath.startsWith(projectRoot)) {
        res.writeHead(403);
        res.end("Acesso negado");
        return;
      }

      fs.readFile(requestedPath, (error, content) => {
        if (error) {
          res.writeHead(404);
          res.end("Arquivo não encontrado");
          return;
        }

        const ext = path.extname(requestedPath).toLowerCase();
        res.writeHead(200, {
          "Content-Type": mimeTypes[ext] || "application/octet-stream"
        });
        res.end(content);
      });
    });

    server.on("error", reject);

    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({ server, url: `http://127.0.0.1:${address.port}/index.html` });
    });
  });
}

async function criarJanela() {
  const { url } = await criarServidorLocal();

  const janela = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: "#050b12",
    title: "Calendário da Copa 2026",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  await janela.loadURL(url);
}

app.whenReady().then(criarJanela);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    criarJanela();
  }
});
