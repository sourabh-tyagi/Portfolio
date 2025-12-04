#!/usr/bin/env python3
"""
Simple static file server with a file-backed visit counter API.

Usage:
  python3 server.py

Endpoints:
  GET  /           -> serves index.html and static files
  POST /api/hit   -> increments visit counter and returns JSON {"count": N}
  GET  /api/count -> returns JSON {"count": N} without incrementing

This avoids external dependencies by extending Python's http.server.
"""
import json
import os
from http import HTTPStatus
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

COUNTER_FILE = 'counter.json'

def read_count():
    if not os.path.exists(COUNTER_FILE):
        return 0
    try:
        with open(COUNTER_FILE, 'r') as f:
            data = json.load(f)
            return int(data.get('count', 0))
    except Exception:
        return 0

def write_count(n):
    with open(COUNTER_FILE, 'w') as f:
        json.dump({'count': n}, f)

class Handler(SimpleHTTPRequestHandler):
    def _set_json_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()

    def do_OPTIONS(self):
        # Support preflight for POST
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/hit':
            # Simple file-backed increment
            count = read_count()
            count += 1
            try:
                write_count(count)
            except Exception:
                pass
            self._set_json_headers(200)
            self.wfile.write(json.dumps({'count': count}).encode('utf-8'))
            return
        # fallback
        return super().do_POST()

    def do_GET(self):
        if self.path == '/api/count':
            count = read_count()
            self._set_json_headers(200)
            self.wfile.write(json.dumps({'count': count}).encode('utf-8'))
            return
        # serve index for root and static assets for everything else
        return super().do_GET()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', '8000'))
    addr = ('', port)
    print(f'Serving on http://localhost:{port} — use Ctrl-C to stop')
    # Ensure counter file exists
    if not os.path.exists(COUNTER_FILE):
        write_count(0)
    with ThreadingHTTPServer(addr, Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\nServer stopped')
