// Tiny static server for the dependency-free BrickShare frontend.
// It serves .jsx modules as JavaScript so the planned component files can run in-browser.

const fs = require("fs");
const http = require("http");
const path = require("path");

const PORT = process.env.PORT || 5173;
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;

const contentTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".jsx": "application/javascript",
  ".json": "application/json",
};

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "text/plain",
      "Cache-Control": "no-store",
    });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const requestedPath = req.url === "/" ? "/index.html" : req.url;
  const filePath = path.join(ROOT, requestedPath.split("?")[0]);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

  sendFile(res, filePath);
});

server.listen(PORT, HOST, () => {
  console.log(`BrickShare frontend running on http://localhost:${PORT}`);
});
