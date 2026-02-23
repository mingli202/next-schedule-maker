globalThis.__nitro_main__ = import.meta.url;
import { N as NodeResponse, s as serve } from "./_libs/srvx.mjs";
import { d as defineHandler, H as HTTPError, t as toEventHandler, a as defineLazyEventHandler, b as H3Core } from "./_libs/h3.mjs";
import { d as decodePath, w as withLeadingSlash, a as withoutTrailingSlash, j as joinURL } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import "node:http";
import "node:stream";
import "node:https";
import "node:http2";
import "./_libs/rou3.mjs";
function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled;
  const status = error.status || 500;
  const url = event.url || new URL(event.req.url);
  if (status === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.req.method}] ${url}
`, error);
  }
  const headers2 = {
    "content-type": "application/json",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "no-referrer",
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  if (status === 404 || !event.res.headers.has("cache-control")) {
    headers2["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    status,
    statusText: error.statusText,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status,
    statusText: error.statusText,
    headers: headers2,
    body
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
const headers = ((m) => function headersRouteRule(event) {
  for (const [key2, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key2, value);
  }
});
const assets = {
  "/manifest.json": {
    "type": "application/json",
    "etag": '"27a-IJS1bBwadEwORxxfOnAHmhJT7dI"',
    "mtime": "2026-02-23T20:27:39.431Z",
    "size": 634,
    "path": "../public/manifest.json"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"',
    "mtime": "2026-02-23T20:27:39.431Z",
    "size": 0,
    "path": "../public/robots.txt"
  },
  "/assets/gh icon.png": {
    "type": "image/png",
    "etag": '"619-4y3wu4Gqga8KB+cxhbENsZqqwu0"',
    "mtime": "2026-02-23T20:27:39.432Z",
    "size": 1561,
    "path": "../public/assets/gh icon.png"
  },
  "/sitemap.xml": {
    "type": "application/xml",
    "etag": '"837-OnIjKcTZAKu2S2nI10HdLKU7/tE"',
    "mtime": "2026-02-23T20:27:39.431Z",
    "size": 2103,
    "path": "../public/sitemap.xml"
  },
  "/assets/globals-DHbEnQGF.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"779d-aU3UdgmAtJ4dvr8QsKN8anSmTg8"',
    "mtime": "2026-02-23T20:27:38.943Z",
    "size": 30621,
    "path": "../public/assets/globals-DHbEnQGF.css"
  },
  "/assets/google icon.png": {
    "type": "image/png",
    "etag": '"1ad0e-kpoggtZBySMal2QRZHNR6fpLQDE"',
    "mtime": "2026-02-23T20:27:39.432Z",
    "size": 109838,
    "path": "../public/assets/google icon.png"
  },
  "/assets/logo.png": {
    "type": "image/png",
    "etag": '"7d9-mT56OZqsQaVWuf5B9dHRKCGlniw"',
    "mtime": "2026-02-23T20:27:39.432Z",
    "size": 2009,
    "path": "../public/assets/logo.png"
  },
  "/assets/index--XwtvPeo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2e022-t6v4HfmD46vHSAliJQiFVG13DOI"',
    "mtime": "2026-02-23T20:27:38.943Z",
    "size": 188450,
    "path": "../public/assets/index--XwtvPeo.js"
  },
  "/assets/loading.gif": {
    "type": "image/gif",
    "etag": '"25e6c-aTFRQ4J0l1HC4QteDF/VDHOzuRc"',
    "mtime": "2026-02-23T20:27:39.432Z",
    "size": 155244,
    "path": "../public/assets/loading.gif"
  },
  "/assets/route-C8EXnlzt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"dd-XgzMSU3h5Ul4aO1df623rc1nrbE"',
    "mtime": "2026-02-23T20:27:38.943Z",
    "size": 221,
    "path": "../public/assets/route-C8EXnlzt.js"
  },
  "/assets/route-DiWRthlU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"dc-YIHJPTyyKQnmd6XYD8XGovydBc4"',
    "mtime": "2026-02-23T20:27:38.943Z",
    "size": 220,
    "path": "../public/assets/route-DiWRthlU.js"
  },
  "/assets/route-WxXTZJLJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"dd-IUH1m1Peqbj1TNGe+fSJc32wZOc"',
    "mtime": "2026-02-23T20:27:38.943Z",
    "size": 221,
    "path": "../public/assets/route-WxXTZJLJ.js"
  },
  "/assets/myWorker-CWSCsUK3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"42a90-scrH+l9foXkfjVRjoEOa2G9Dpos"',
    "mtime": "2026-02-23T20:27:38.944Z",
    "size": 273040,
    "path": "../public/assets/myWorker-CWSCsUK3.js"
  },
  "/json/colors.json": {
    "type": "application/json",
    "etag": '"e0-KsgkpZgbiHjmNx5RxeUi4e2W9dw"',
    "mtime": "2026-02-23T20:27:39.431Z",
    "size": 224,
    "path": "../public/json/colors.json"
  },
  "/json/professors.json": {
    "type": "application/json",
    "etag": '"1b98-fwtqPKmL2aIqsPH23A7z5i9zbKk"',
    "mtime": "2026-02-23T20:27:39.431Z",
    "size": 7064,
    "path": "../public/json/professors.json"
  },
  "/assets/main-C89q-grd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"97671-Zmf/XbK64QmU7XoodTs0468mTzo"',
    "mtime": "2026-02-23T20:27:38.944Z",
    "size": 620145,
    "path": "../public/assets/main-C89q-grd.js"
  },
  "/json/allClasses.json": {
    "type": "application/json",
    "etag": '"c3254-/RwKKaDPh5km4uR6tVXxFs83pe0"',
    "mtime": "2026-02-23T20:27:39.431Z",
    "size": 799316,
    "path": "../public/json/allClasses.json"
  }
};
function readAsset(id) {
  const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
  return promises.readFile(resolve(serverDir, assets[id].path));
}
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
function getAsset(id) {
  return assets[id];
}
const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = {
  gzip: ".gz",
  br: ".br",
  zstd: ".zst"
};
const _0A0PZP = defineHandler((event) => {
  if (event.req.method && !METHODS.has(event.req.method)) {
    return;
  }
  let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
  let asset;
  const encodingHeader = event.req.headers.get("accept-encoding") || "";
  const encodings = [...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
  if (encodings.length > 1) {
    event.res.headers.append("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.res.headers.delete("Cache-Control");
      throw new HTTPError({ status: 404 });
    }
    return;
  }
  const ifNotMatch = event.req.headers.get("if-none-match") === asset.etag;
  if (ifNotMatch) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  const ifModifiedSinceH = event.req.headers.get("if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  if (asset.type) {
    event.res.headers.set("Content-Type", asset.type);
  }
  if (asset.etag && !event.res.headers.has("ETag")) {
    event.res.headers.set("ETag", asset.etag);
  }
  if (asset.mtime && !event.res.headers.has("Last-Modified")) {
    event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.res.headers.has("Content-Encoding")) {
    event.res.headers.set("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.res.headers.has("Content-Length")) {
    event.res.headers.set("Content-Length", asset.size.toString());
  }
  return readAsset(id);
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/");
    s.length - 1;
    if (s[1] === "assets") {
      r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
    }
    return r;
  };
})();
const _lazy_XW22Lj = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_XW22Lj };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const globalMiddleware = [
  toEventHandler(_0A0PZP)
].filter(Boolean);
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function createNitroApp() {
  const hooks = void 0;
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({
          error,
          context: errorCtx
        });
      }
    }
  };
  const h3App = createH3App({ onError(error, event) {
    return errorHandler(error, event);
  } });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  const app = {
    fetch: appHandler,
    h3: h3App,
    hooks,
    captureError
  };
  return app;
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  h3App["~middleware"].push(...globalMiddleware);
  {
    h3App["~getMiddleware"] = (event, route) => {
      const pathname = event.url.pathname;
      const method = event.req.method;
      const middleware = [];
      {
        const routeRules = getRouteRules(method, pathname);
        event.context.routeRules = routeRules?.routeRules;
        if (routeRules?.routeRuleMiddleware.length) {
          middleware.push(...routeRules.routeRuleMiddleware);
        }
      }
      middleware.push(...h3App["~middleware"]);
      if (route?.data?.middleware?.length) {
        middleware.push(...route.data.middleware);
      }
      return middleware;
    };
  }
  return h3App;
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  for (const rule of Object.values(routeRules)) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
  process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
  process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
const _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
const port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
const host = process.env.NITRO_HOST || process.env.HOST;
const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
serve({
  port,
  hostname: host,
  tls: cert && key ? {
    cert,
    key
  } : void 0,
  fetch: nitroApp.fetch
});
trapUnhandledErrors();
const nodeServer = {};
export {
  nodeServer as default
};
