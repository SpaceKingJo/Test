모바일 청첩장 (DB 방명록 + QR 공유)

1) 실행
- python3 server.py
- 브라우저에서 http://localhost:4173 접속

2) 방명록 저장 방식
- server.py가 SQLite DB(guestbook.db)에 방명록을 저장합니다.
- 하객이 남긴 메시지는 모든 방문자에게 공유됩니다.

3) 외부 QR 공유
- 이 프로젝트를 외부에 배포한 뒤 공개 URL을 settings.js의 INVITATION_URL에 넣으세요.
  예) window.INVITATION_URL = "https://your-wedding-site.com";
- QR 코드는 해당 URL로 생성되어 하객이 외부에서 접속할 수 있습니다.

4) API
- GET /api/guestbook : 방명록 목록 조회
- POST /api/guestbook : 방명록 작성
  JSON: {"name":"홍길동", "message":"축하해요!"}
