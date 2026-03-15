const copyButtons = document.querySelectorAll("[data-copy]");
const guestbookForm = document.querySelector("#guestbook-form");
const guestbookList = document.querySelector("#guestbook-list");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const closeLightbox = document.querySelector("#close-lightbox");
const apiBase = window.location.origin;
const invitationUrl = (window.INVITATION_URL || "").trim() || window.location.href;

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "복사 완료";
      setTimeout(() => {
        button.textContent = "계좌번호 복사";
      }, 1200);
    } catch {
      alert("클립보드 복사에 실패했어요. 길게 눌러 직접 복사해 주세요.");
    }
  });
});

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderGuestbook(items) {
  guestbookList.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("li");
    empty.textContent = "첫 번째 축하 메시지를 남겨주세요 💌";
    guestbookList.append(empty);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.message)}</p><span>${item.created_at}</span>`;
    guestbookList.append(li);
  });
}

async function loadGuestbook() {
  try {
    const response = await fetch(`${apiBase}/api/guestbook`);
    if (!response.ok) {
      throw new Error("방명록 조회 실패");
    }
    const items = await response.json();
    renderGuestbook(items);
  } catch {
    guestbookList.innerHTML = "";
    const failed = document.createElement("li");
    failed.textContent = "방명록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
    guestbookList.append(failed);
  }
}

guestbookForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nameInput = document.querySelector("#name");
  const messageInput = document.querySelector("#message");

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !message) {
    return;
  }

  try {
    const response = await fetch(`${apiBase}/api/guestbook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, message }),
    });

    const payload = await response.json();

    if (!response.ok) {
      alert(payload.error || "메시지 저장에 실패했어요.");
      return;
    }

    guestbookForm.reset();
    await loadGuestbook();
  } catch {
    alert("네트워크 오류로 메시지를 저장하지 못했어요.");
  }
});

document.querySelectorAll(".thumb").forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.src;
    lightbox.showModal();
  });
});

closeLightbox.addEventListener("click", () => {
  lightbox.close();
});

lightbox.addEventListener("click", (event) => {
  const rect = lightbox.getBoundingClientRect();
  const clickedOutside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (clickedOutside) {
    lightbox.close();
  }
});

new QRCode(document.querySelector("#qrcode"), {
  text: invitationUrl,
  width: 148,
  height: 148,
  colorDark: "#352e2a",
  colorLight: "#ffffff",
});

loadGuestbook();
