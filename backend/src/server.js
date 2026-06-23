// Dependency-free HTTP API server for the BrickShare MVP backend.

const http = require("http");
const { URL } = require("url");
const dashboardRoutes = require("./routes/dashboardRoutes");
const primaryOfferingRoutes = require("./routes/primaryOfferingRoutes");
const rentalRoutes = require("./routes/rentalRoutes");

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "127.0.0.1";

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(body));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;
    });

    req.on("end", () => {
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch (error) {
        reject(new Error("Request body must be valid JSON."));
      }
    });
  });
}

async function handleRequest(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (req.method === "GET" && pathname === "/api/health") {
      sendJson(res, 200, { status: "ok", service: "brickshare-backend" });
      return;
    }

    if (req.method === "GET" && pathname === "/api/dashboard") {
      const result = dashboardRoutes.getDashboard();
      sendJson(res, result.statusCode, result.body);
      return;
    }

    if (req.method === "POST" && pathname === "/api/reset") {
      const result = dashboardRoutes.resetDashboard();
      sendJson(res, result.statusCode, result.body);
      return;
    }

    if (req.method === "POST" && pathname === "/api/properties/list") {
      const result = primaryOfferingRoutes.listProperty(await readJsonBody(req));
      sendJson(res, result.statusCode, result.body);
      return;
    }

    if (req.method === "POST" && pathname === "/api/properties/approve") {
      const result = primaryOfferingRoutes.approveAndTokenize(
        await readJsonBody(req)
      );
      sendJson(res, result.statusCode, result.body);
      return;
    }

    if (req.method === "POST" && pathname === "/api/investments") {
      const result = primaryOfferingRoutes.buyTokens(await readJsonBody(req));
      sendJson(res, result.statusCode, result.body);
      return;
    }

    if (req.method === "POST" && pathname === "/api/rent/distribute") {
      const result = rentalRoutes.distributeRent(await readJsonBody(req));
      sendJson(res, result.statusCode, result.body);
      return;
    }

    if (req.method === "POST" && pathname === "/api/rent/claim") {
      const result = rentalRoutes.claimRent(await readJsonBody(req));
      sendJson(res, result.statusCode, result.body);
      return;
    }

    sendJson(res, 404, {
      success: false,
      reason: "API route not found.",
    });
  } catch (error) {
    sendJson(res, 400, {
      success: false,
      reason: error.message,
    });
  }
}

const server = http.createServer(handleRequest);

if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(`BrickShare backend running on http://localhost:${PORT}`);
  });
}

module.exports = server;
