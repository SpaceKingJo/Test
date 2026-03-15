Premium Korean Mobile Wedding Invitation

주요 기능
- 풀스크린 히어로 섹션
- 초대 메시지 / 예식 정보
- 카운트다운 타이머
- Swiper 사진 슬라이더 + 라이트박스
- 네이버 지도 임베드 + 교통 안내
- 계좌번호 복사 버튼
- Google Forms RSVP 버튼
- Utterances 방명록
- 배경음악 토글
- 카카오톡 공유 버튼
- QR 코드 생성
- AOS 스크롤 애니메이션

설정
1) settings.js 수정
- INVITATION_URL: 실제 배포 주소
- RSVP_FORM_URL: 구글폼 링크
- UTTERANCES_REPO: Utterances 연결 레포(owner/repo)
- KAKAO_APP_KEY: 카카오 JavaScript 키

2) 실행
- 정적 파일 서버로 실행하면 됩니다.
  예: python3 -m http.server 4173

3) 접속
- http://localhost:4173
