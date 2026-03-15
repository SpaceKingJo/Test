const copyButtons = document.querySelectorAll("[data-copy]");
const guestbookForm = document.querySelector("#guestbook-form");
const guestbookList = document.querySelector("#guestbook-list");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const closeLightbox = document.querySelector("#close-lightbox");
const storageKey = "mobile-wedding-guestbook";

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

function readGuestbook() {
  return JSON.parse(localStorage.getItem(storageKey) ?? "[]");
}

function saveGuestbook(items) {
  localStorage.setItem(storageKey, JSON.stringify(items));
}

function renderGuestbook() {
  const items = readGuestbook();
  guestbookList.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("li");
    empty.textContent = "첫 번째 축하 메시지를 남겨주세요 💌";
    guestbookList.append(empty);
    return;
  }

  items
    .slice()
    .reverse()
    .forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${item.name}</strong><p>${item.message}</p><span>${item.date}</span>`;
      guestbookList.append(li);
    });
}

guestbookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameInput = document.querySelector("#name");
  const messageInput = document.querySelector("#message");

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !message) {
    return;
  }

  const newEntry = {
    name,
    message,
    date: new Date().toLocaleString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const items = readGuestbook();
  items.push(newEntry);
  saveGuestbook(items);

  guestbookForm.reset();
  renderGuestbook();
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
  text: window.location.href,
  width: 148,
  height: 148,
  colorDark: "#352e2a",
  colorLight: "#ffffff",
});

renderGuestbook();
