from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os, webbrowser

ROOT = Path(__file__).resolve().parent
os.chdir(ROOT)

class KTPHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self' https://unpkg.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https://*.tile.openstreetmap.org https://tile.openstreetmap.org https:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'")
        super().end_headers()

server = None
for port in range(8080, 8091):
    try:
        server = ThreadingHTTPServer(("127.0.0.1", port), KTPHandler)
        break
    except OSError:
        continue
if server is None:
    raise SystemExit("No free local port found between 8080 and 8090. Close an old TERRAPULSE server and try again.")
url = f"http://127.0.0.1:{server.server_address[1]}"
print("\n KUNTAU TERRAPULSE · KTP v0.5.0")
print(" --------------------------------")
print(" Installable local-first Earth-observation studio")
print(" 3D space scene is decorative; scientific maps use loaded raster data.")
print(f" Open this address: {url}")
print(" Security: server bound to this computer only (127.0.0.1).")
print(" Keep this black window open while using the app.")
print(" Press Ctrl+C to stop the server.\n")
webbrowser.open(url)
try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\nKTP local server stopped.")
finally:
    server.server_close()
