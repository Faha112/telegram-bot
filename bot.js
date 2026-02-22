const TelegramBot = require('node-telegram-bot-api');

const token = '8137493566:AAF7ReTUb8H5_rAGP3tBm3oUpu-qTXRxsBU';

const bot = new TelegramBot(token, { polling: true });

console.log("🤖 Bot started...");


// =======================
// ADMIN IDS
// =======================

const admins = [1444286803, 1546654083];


// =======================
// MEMORY DATABASE
// =======================

let courses = [];
let users = {};


// =======================
// START
// =======================

bot.onText(/\/start/, (msg) => {

    const id = msg.from.id;

    if (!users[id]) {
        users[id] = {
            name: msg.from.first_name,
            courses: []
        };
    }

    bot.sendMessage(id, "Добро пожаловать 👋");
});


// =======================
// ADMIN PANEL
// =======================

bot.onText(/\/admin/, (msg) => {

    const id = msg.from.id;

    if (!admins.includes(id)) return;

    bot.sendMessage(id,
        `👨‍💻 Админ панель

/addcourse — добавить курс
/courses — список курсов
/users — ученики
/grant — выдать доступ`
    );

});


// =======================
// ADD COURSE
// =======================

bot.onText(/\/addcourse (.+)/, (msg, match) => {

    const id = msg.from.id;
    if (!admins.includes(id)) return;

    const name = match[1];

    courses.push({
        name,
        price: 0
    });

    bot.sendMessage(id, `✅ Курс добавлен: ${name}`);

});


// =======================
// LIST COURSES
// =======================

bot.onText(/\/courses/, (msg) => {

    const id = msg.from.id;
    if (!admins.includes(id)) return;

    if (courses.length === 0) {
        bot.sendMessage(id, "Курсов нет");
        return;
    }

    let text = "📚 Курсы:\n\n";

    courses.forEach((c, i) => {
        text += `${i + 1}. ${c.name}\n`;
    });

    bot.sendMessage(id, text);

});


// =======================
// USERS
// =======================

bot.onText(/\/users/, (msg) => {

    const id = msg.from.id;
    if (!admins.includes(id)) return;

    let text = "👥 Ученики:\n\n";

    Object.keys(users).forEach(uid => {
        text += `${users[uid].name} — ${uid}\n`;
    });

    bot.sendMessage(id, text);

});


// =======================
// GRANT ACCESS
// =======================

bot.onText(/\/grant (.+)/, (msg, match) => {

    const id = msg.from.id;
    if (!admins.includes(id)) return;

    const parts = match[1].split(" ");

    const userId = parts[0];
    const courseName = parts.slice(1).join(" ");

    if (!users[userId]) {
        bot.sendMessage(id, "❌ Пользователь не найден");
        return;
    }

    users[userId].courses.push(courseName);

    bot.sendMessage(id, "✅ Доступ выдан");

});
