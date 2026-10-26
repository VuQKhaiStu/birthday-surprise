/* ================================= */
/* CẤU HÌNH */
/* ================================= */

const PASSWORD = "486927";
const TARGET_TIME = new Date("2026-10-27T00:00:00+07:00").getTime();
const BIRTHDAY_MESSAGE = `Hi lô cậu iu, chúc mừng sinh nhật iu nhé! 🎂💗

Chúc biu của tớ tuổi mới luôn vui vẻ, thật nhiều sức khỏe, bình an và gặp được thật nhiều điều tốt đẹp.

Cảm ơn biu đã xuất hiện trong cuộc sống của tớ, làm những ngày bình thường trở nên đặc biệt hơn. Mong rằng tớ sẽ được cùng cậu tạo thêm thật nhiều kỷ niệm đáng nhớ nữa.

Cứ luôn là chính cậu, luôn cười thật tươi và nhớ rằng có tớ ở đây cổ vũ cho cậu nhé.

Tớ yêu cậu nhiều lắm. Happy birthday, cục cưng! ❤️`;

let enteredPassword = "";
let countdownTimer = null;
let heartTimer = null;
let messageTimer = null;
let messageSession = 0;
let unlocked = false;

const passwordScreen = document.getElementById("passwordScreen");
const countdownScreen = document.getElementById("countdownScreen");
const birthdayScreen = document.getElementById("birthdayScreen");
const passwordMessage = document.getElementById("passwordMessage");
const passwordDots = document.querySelectorAll(".password-dots span");

/* ================================= */
/* MẬT KHẨU 6 SỐ */
/* ================================= */

document.querySelectorAll("[data-number]").forEach(button => {
    button.addEventListener("click", () => enterNumber(button.dataset.number));
});

document.getElementById("deleteButton").addEventListener("click", deleteNumber);
document.getElementById("replayMessageButton").addEventListener("click", typeBirthdayMessage);

document.addEventListener("keydown", event => {
    if (!passwordScreen.classList.contains("hidden")) {
        if (/^[0-9]$/.test(event.key)) enterNumber(event.key);
        if (event.key === "Backspace") deleteNumber();
        if (event.key === "Enter" && enteredPassword.length === 6) checkPassword();
    }
});

function enterNumber(number) {
    if (unlocked || enteredPassword.length >= 6) return;
    enteredPassword += number;
    updatePasswordDots();
    if (enteredPassword.length === 6) setTimeout(checkPassword, 250);
}

function deleteNumber() {
    if (unlocked) return;
    enteredPassword = enteredPassword.slice(0, -1);
    updatePasswordDots();
}

function updatePasswordDots() {
    passwordDots.forEach((dot, index) => dot.classList.toggle("active", index < enteredPassword.length));
}

function checkPassword() {
    if (unlocked || enteredPassword.length !== 6) return;
    if (enteredPassword === PASSWORD) {
        unlocked = true;
        passwordMessage.textContent = "Đúng rồi, chờ món quà nhé 💗";
        setTimeout(() => {
            passwordScreen.classList.add("hidden");
            const now = Date.now();
            if (now >= TARGET_TIME) {
                revealBirthday();
            } else {
                countdownScreen.classList.remove("hidden");
                startFloatingHearts();
                updateCountdown();
                countdownTimer = setInterval(updateCountdown, 250);
            }
        }, 650);
    } else {
        passwordMessage.textContent = "Chưa đúng rồi, thử lại nhé 🥺";
        const card = document.querySelector(".password-card");
        card.classList.remove("shake");
        void card.offsetWidth;
        card.classList.add("shake");
        enteredPassword = "";
        setTimeout(() => {
            updatePasswordDots();
            passwordMessage.textContent = "";
        }, 900);
    }
}

/* ================================= */
/* ĐẾM NGƯỢC ĐẾN 00:00 NGÀY 27/10 */
/* ================================= */

function updateCountdown() {
    const remaining = TARGET_TIME - Date.now();
    if (remaining <= 0) {
        clearInterval(countdownTimer);
        countdownTimer = null;
        revealBirthday();
        return;
    }
    const totalSeconds = Math.floor(remaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

/* ================================= */
/* KHOẢNH KHẮC SINH NHẬT */
/* ================================= */

function revealBirthday() {
    if (!birthdayScreen.classList.contains("hidden")) return;
    clearInterval(countdownTimer);
    countdownTimer = null;
    countdownScreen.classList.add("hidden");
    birthdayScreen.classList.remove("hidden");
    typeBirthdayMessage();
    startFloatingHearts();
    launchConfetti(90);
}

function typeBirthdayMessage() {
    clearTimeout(messageTimer);
    messageSession++;
    const session = messageSession;
    const output = document.getElementById("birthdayMessage");
    output.textContent = "";
    let index = 0;
    function typeNext() {
        if (session !== messageSession) return;
        if (index >= BIRTHDAY_MESSAGE.length) return;
        output.textContent += BIRTHDAY_MESSAGE[index];
        index++;
        messageTimer = setTimeout(typeNext, 24);
    }
    typeNext();
}

/* ================================= */
/* TRÁI TIM BAY */
/* ================================= */

function startFloatingHearts() {
    if (heartTimer) return;
    createHeart();
    heartTimer = setInterval(createHeart, 650);
}

function createHeart() {
    const container = document.getElementById("floatingHearts");
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = Math.random() > 0.5 ? "♡" : "♥";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = 13 + Math.random() * 22 + "px";
    heart.style.animationDuration = 5 + Math.random() * 5 + "s";
    heart.style.color = ["#d94f8d", "#ef78aa", "#ffffff", "#c75b89"][Math.floor(Math.random() * 4)];
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 10500);
}

/* ================================= */
/* CONFETTI SINH NHẬT */
/* ================================= */

function launchConfetti(amount) {
    const container = document.getElementById("celebrationEffects");
    const colors = ["#f06fa4", "#f7c6dc", "#ffffff", "#d8a6e8", "#f3c66b", "#e98dba"];
    for (let i = 0; i < amount; i++) {
        const piece = document.createElement("span");
        piece.className = "confetti";
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = 3 + Math.random() * 4 + "s";
        piece.style.animationDelay = Math.random() * 1.2 + "s";
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(piece);
        setTimeout(() => piece.remove(), 8500);
    }
}
