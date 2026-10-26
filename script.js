const PASSWORD = "486927";
let enteredPassword = "";
let countdownTimer = null;
let currentQuestion = 0;
let answers = JSON.parse(localStorage.getItem("birthdayAnswers")) || ["", "", ""];

const questions = [
    {
        icon: "💭",
        title: "Câu 1",
        text: "Trong những lần sinh nhật trước, có khoảnh khắc nào khiến cậu nhớ mãi đến tận bây giờ không? Kể tớ nghe với nhé 💗",
        placeholder: "Cậu kể tớ nghe đi..."
    },
    {
        icon: "🎁",
        title: "Câu 2",
        text: "Nếu được tự chọn một điều ước cho sinh nhật năm nay, cậu sẽ ước điều gì?",
        placeholder: "Điều ước của cậu là..."
    },
    {
        icon: "❤️",
        title: "Câu 3",
        text: "Nếu sinh nhật năm nay có thể lưu lại một kỷ niệm thật đẹp, cậu muốn nó sẽ là kỷ niệm như thế nào?",
        placeholder: "Tớ muốn nghe điều này..."
    }
];

const birthdayMessage = `Hi cậu, lần đầu tớ làm cái này có lẽ sẽ không được mượt cho lắm nhưng mà tớ vẫn muốn gửi gắm tình cảm này của mình vào nó để chuyển đến cậu hihi.

Nếu cậu thích những kiểu như này thì sau này tớ sẽ làm nhiều thêm.

Hì hì.

Tớ yêu cậu ❤️`;

function enterNumber(number) {
    if (enteredPassword.length >= 6) return;
    enteredPassword += number;
    updatePasswordDots();
    if (enteredPassword.length === 6) {
        setTimeout(checkPassword, 300);
    }
}

function deleteNumber() {
    enteredPassword = enteredPassword.slice(0, -1);
    updatePasswordDots();
}

function updatePasswordDots() {
    document.querySelectorAll(".password-dots span").forEach((dot, index) => {
        dot.classList.toggle("active", index < enteredPassword.length);
    });
}

function checkPassword() {
    const message = document.getElementById("passwordMessage");

    if (enteredPassword === PASSWORD) {
        message.textContent = "Đúng rồi ❤️";
        setTimeout(() => {
            document.getElementById("passwordScreen").classList.add("hidden");
            document.getElementById("countdownScreen").classList.remove("hidden");
            startCountdown();
            startFloatingHearts();
        }, 700);
    } else {
        message.textContent = "Sai rồi nè 🥺";
        const box = document.querySelector(".password-box");
        box.classList.add("shake");

        setTimeout(() => {
            box.classList.remove("shake");
            enteredPassword = "";
            updatePasswordDots();
            message.textContent = "";
        }, 700);
    }
}

function startCountdown() {
    if (countdownTimer) clearInterval(countdownTimer);

    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const target = new Date("2026-10-27T00:00:00+07:00");
    const now = new Date();
    const difference = target - now;

    if (difference <= 0) {
        clearInterval(countdownTimer);
        showBirthday();
        return;
    }

    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference / 3600000) % 24);
    const minutes = Math.floor((difference / 60000) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");

    updateCountdownMessage(seconds);
}

function updateCountdownMessage(seconds) {
    const messages = [
        "Một điều đặc biệt đang chờ cậu ở phía trước... 💗",
        "Còn một chút nữa thôi... 🎂",
        "Cậu có đoán được điều gì đang chờ không? 👀",
        "Tớ đang rất mong đến thời khắc đó... ❤️",
        "Hôm nay là ngày của cậu đó nha 🎀"
    ];

    const index = Math.floor(seconds / 10) % messages.length;
    document.getElementById("countdownMessage").textContent = messages[index];
}

function openGame() {
    currentQuestion = 0;
    document.getElementById("countdownScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");
    renderQuestion();
}

function renderQuestion() {
    const question = questions[currentQuestion];
    const content = document.getElementById("questionContent");

    content.innerHTML = `
        <div class="question-icon">${question.icon}</div>
        <p class="question-label">${question.title}</p>
        <h2>${question.text}</h2>
        <textarea id="answerInput" maxlength="1000" placeholder="${question.placeholder}">${answers[currentQuestion]}</textarea>
    `;

    document.getElementById("questionNumber").textContent = `${currentQuestion + 1} / ${questions.length}`;
    document.getElementById("progressBar").style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

    document.getElementById("gameBackButton").style.visibility = currentQuestion === 0 ? "hidden" : "visible";

    const nextButton = document.getElementById("gameNextButton");
    nextButton.textContent = currentQuestion === questions.length - 1 ? "💌 Gửi câu trả lời" : "Tiếp tục →";
}

function saveCurrentAnswer() {
    const input = document.getElementById("answerInput");

    if (!input) return true;

    const value = input.value.trim();

    if (!value) {
        input.classList.add("input-error");
        input.focus();

        setTimeout(() => {
            input.classList.remove("input-error");
        }, 500);

        return false;
    }

    answers[currentQuestion] = value;
    localStorage.setItem("birthdayAnswers", JSON.stringify(answers));
    return true;
}

function nextQuestion() {
    if (!saveCurrentAnswer()) return;

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        submitAnswers();
    }
}

function previousQuestion() {
    saveCurrentAnswer();

    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}

async function submitAnswers() {
    const button = document.getElementById("gameNextButton");

    button.disabled = true;
    button.textContent = "Đang gửi... 💌";

    const formData = new FormData();
    formData.append("question_1", answers[0]);
    formData.append("question_2", answers[1]);
    formData.append("question_3", answers[2]);
    formData.append("submitted_at", new Date().toLocaleString("vi-VN"));

    try {
        const response = await fetch("https://formspree.io/f/mdeeedyn", {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json"
            }
        });

        if (!response.ok) throw new Error();

        localStorage.removeItem("birthdayAnswers");

        document.getElementById("gameScreen").classList.add("hidden");
        document.getElementById("countdownScreen").classList.remove("hidden");

        document.getElementById("countdownMessage").textContent = "Tớ đã nhận được câu trả lời của cậu rồi 💌";

    } catch (error) {
        button.disabled = false;
        button.textContent = "💌 Gửi câu trả lời";
        alert("Có lỗi khi gửi câu trả lời. Kiểm tra lại kết nối mạng nhé.");
    }
}

function showBirthday() {
    document.getElementById("countdownScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("birthdayScreen").classList.remove("hidden");

    createFinalHearts();
    typeBirthdayMessage();
}

function typeBirthdayMessage() {
    const element = document.getElementById("birthdayMessage");
    element.textContent = "";

    let index = 0;

    function type() {
        if (index >= birthdayMessage.length) return;

        element.textContent += birthdayMessage[index];
        index++;

        setTimeout(type, 30);
    }

    type();
}

function replayBirthdayMessage() {
    typeBirthdayMessage();
}

function toggleMusic() {
    const music = document.getElementById("bgMusic");
    const button = document.getElementById("musicButton");

    if (music.paused) {
        music.play();
        button.textContent = "🔊";
    } else {
        music.pause();
        button.textContent = "🔇";
    }
}

function startFloatingHearts() {
    setInterval(createHeart, 1000);
}

function createHeart() {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = Math.random() > 0.5 ? "♡" : "♥";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = 12 + Math.random() * 20 + "px";
    heart.style.animationDuration = 5 + Math.random() * 5 + "s";

    document.getElementById("floatingHearts").appendChild(heart);

    setTimeout(() => heart.remove(), 10000);
}

function createFinalHearts() {
    for (let i = 0; i < 60; i++) {
        setTimeout(createHeart, i * 80);
    }
}