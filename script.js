const weddingDate = new Date("2026-07-25T18:10:00+09:00");
const shareUrl = (window.INVITATION_URL || "").trim() || window.location.href;

const dayEl = document.querySelector("#d-day");
const hourEl = document.querySelector("#d-hour");
const minEl = document.querySelector("#d-min");
const secEl = document.querySelector("#d-sec");

const accountButton = document.querySelector("#copy-account");
const accountValue = document.querySelector("#bank-account").textContent.trim();
const copyLinkButton = document.querySelector("#copy-link");
const kakaoShareButton = document.querySelector("#kakao-share");
const musicToggleButton = document.querySelector("#music-toggle");
const bgm = document.querySelector("#bgm");
const rsvpLink = document.querySelector("#rsvp-link");

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const closeLightbox = document.querySelector("#close-lightbox");

function updateCountdown() {
  const now = new Date();
  const diffMs = weddingDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    dayEl.textContent = "0";
    hourEl.textContent = "0";
    minEl.textContent = "0";
    secEl.textContent = "0";
    return;
  }

  const totalSec = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  dayEl.textContent = String(days);
  hourEl.textContent = String(hours).padStart(2, "0");
  minEl.textContent = String(mins).padStart(2, "0");
  secEl.textContent = String(secs).padStart(2, "0");
}

new Swiper(".gallery-swiper", {
  loop: true,
  spaceBetween: 8,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});

document.querySelectorAll(".gallery-swiper img").forEach((image) => {
  image.addEventListener("click", () => {
    lightboxImage.src = image.src;
    lightbox.showModal();
  });
});

closeLightbox.addEventListener("click", () => lightbox.close());

lightbox.addEventListener("click", (event) => {
  const rect = lightbox.getBoundingClientRect();
  const outside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (outside) {
    lightbox.close();
  }
});

accountButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(accountValue);
    accountButton.textContent = "복사 완료";
    setTimeout(() => {
      accountButton.textContent = "계좌번호 복사";
    }, 1200);
  } catch {
    alert("복사에 실패했습니다. 직접 길게 눌러 복사해 주세요.");
  }
});

copyLinkButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(shareUrl);
    copyLinkButton.textContent = "링크 복사됨";
    setTimeout(() => {
      copyLinkButton.textContent = "링크 복사";
    }, 1200);
  } catch {
    alert("링크 복사에 실패했습니다.");
  }
});

musicToggleButton.addEventListener("click", async () => {
  if (bgm.paused) {
    try {
      await bgm.play();
      musicToggleButton.textContent = "배경음악 정지";
    } catch {
      alert("브라우저 정책상 자동 재생이 제한됩니다. 다시 눌러주세요.");
    }
  } else {
    bgm.pause();
    musicToggleButton.textContent = "배경음악 재생";
  }
});

new QRCode(document.querySelector("#qrcode"), {
  text: shareUrl,
  width: 148,
  height: 148,
  colorDark: "#333333",
  colorLight: "#ffffff",
});

AOS.init({
  duration: 700,
  once: true,
});

rsvpLink.href = window.RSVP_FORM_URL || "https://docs.google.com/forms";

function loadUtterances() {
  const container = document.querySelector("#utterances-container");
  if (!window.UTTERANCES_REPO) {
    container.innerHTML = '<p class="small">Utterances 저장소 설정이 필요합니다. settings.js의 UTTERANCES_REPO를 입력해 주세요.</p>';
    return;
  }

  const script = document.createElement("script");
  script.src = "https://utteranc.es/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.setAttribute("repo", window.UTTERANCES_REPO);
  script.setAttribute("issue-term", "pathname");
  script.setAttribute("theme", "github-light");
  container.append(script);
}

function initKakaoShare() {
  if (!(window.Kakao && window.KAKAO_APP_KEY)) {
    return;
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(window.KAKAO_APP_KEY);
  }

  kakaoShareButton.addEventListener("click", () => {
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "조학현 ♥ 이경민 모바일 청첩장",
        description: "2026.07.25 18:10 | 라마다 신도림 호텔",
        imageUrl:
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: "청첩장 보기",
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);
loadUtterances();
initKakaoShare();
