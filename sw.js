const CACHE = "kagi-v4";
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "sw.js",
  "icon-192.png",
  "icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then((res) => {
      return (
        res ||
        fetch(req).then((net) => {
          if (req.method === "GET" && (req.url.startsWith(self.location.origin) || req.url.startsWith("https://cdnjs.cloudflare.com"))) {
            const copy = net.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(()=>{});
          }
          return net;
        }).catch(() => caches.match("index.html"))
      );
    })
  );
});
