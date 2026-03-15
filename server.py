#!/usr/bin/env python3
from __future__ import annotations

import json
import sqlite3
from datetime import datetime
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT_DIR = Path(__file__).resolve().parent
DB_PATH = ROOT_DIR / "guestbook.db"
MAX_NAME_LENGTH = 12
MAX_MESSAGE_LENGTH = 140


def init_db() -> None:
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS guestbook_entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )


class InvitationHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT_DIR), **kwargs)

    def _send_json(self, payload: dict | list, status: int = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self) -> dict | None:
        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)
        try:
            return json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError:
            return None

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/guestbook":
            self.handle_guestbook_list()
            return
        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/guestbook":
            self.handle_guestbook_create()
            return
        self.send_error(HTTPStatus.NOT_FOUND, "Not Found")

    def handle_guestbook_list(self) -> None:
        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                """
                SELECT id, name, message, created_at
                FROM guestbook_entries
                ORDER BY id DESC
                LIMIT 100
                """
            ).fetchall()

        entries = [dict(row) for row in rows]
        self._send_json(entries)

    def handle_guestbook_create(self) -> None:
        payload = self._read_json()
        if payload is None:
            self._send_json({"error": "잘못된 JSON 형식입니다."}, HTTPStatus.BAD_REQUEST)
            return

        name = str(payload.get("name", "")).strip()
        message = str(payload.get("message", "")).strip()

        if not name or not message:
            self._send_json({"error": "이름과 메시지를 입력해 주세요."}, HTTPStatus.BAD_REQUEST)
            return

        if len(name) > MAX_NAME_LENGTH or len(message) > MAX_MESSAGE_LENGTH:
            self._send_json(
                {
                    "error": f"이름은 {MAX_NAME_LENGTH}자, 메시지는 {MAX_MESSAGE_LENGTH}자 이내로 입력해 주세요."
                },
                HTTPStatus.BAD_REQUEST,
            )
            return

        created_at = datetime.now().strftime("%m.%d %H:%M")

        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.execute(
                """
                INSERT INTO guestbook_entries (name, message, created_at)
                VALUES (?, ?, ?)
                """,
                (name, message, created_at),
            )
            entry_id = cursor.lastrowid

        self._send_json(
            {
                "id": entry_id,
                "name": name,
                "message": message,
                "created_at": created_at,
            },
            HTTPStatus.CREATED,
        )


def run_server(port: int = 4173) -> None:
    init_db()
    server = ThreadingHTTPServer(("0.0.0.0", port), InvitationHandler)
    print(f"Serving invitation on http://0.0.0.0:{port}")
    server.serve_forever()


if __name__ == "__main__":
    run_server()
