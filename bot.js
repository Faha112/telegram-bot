const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const ADMIN_ID = 1444286803;

let db = { courses: [] };

if (fs.existsSync("db.json")) {
  db = JSON.parse(fs.readFileSync("db.json"));
}

function save() {
  fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
}

/* ADD COURSE */

bot.onText(/\/addcourse (.+)/, (msg, match) => {

  if (msg.from.id !== ADMIN_ID) return;

  const parts = match[1].split("|");

  const title = parts[0]?.trim();
  const desc = parts[1]?.trim();
  const price = parts[2]?.trim();

  db.courses.push({ title, desc, price });
  save();

  bot.sendMessage(msg.chat.id, "✅ Курс добавлен");
});

/* EDIT COURSE */

bot.onText(/\/editcourse (.+)/, (msg, match) => {

  if (msg.from.id !== ADMIN_ID) return;

  const parts = match[1].split("|");

  const title = parts[0]?.trim();
  const desc = parts[1]?.trim();
  const price = parts[2]?.trim();

  const course = db.courses.find(c => c.title === title);

  if (!course) return bot.sendMessage(msg.chat.id, "❌ Не найден");

  course.desc = desc;
  course.price = price;

  save();

  bot.sendMessage(msg.chat.id, "✅ Обновлено");
});

/* DELETE */

bot.onText(/\/deletecourse (.+)/, (msg, match) => {

  if (msg.from.id !== ADMIN_ID) return;

  const title = match[1];

  db.courses = db.courses.filter(c => c.title !== title);
  save();

  bot.sendMessage(msg.chat.id, "🗑 Удалено");
});

/* LIST */

bot.onText(/\/courses/, (msg) => {

  let text = "📚 Курсы:\n\n";

  db.courses.forEach(c => {
    text += ${c.title} — ${c.price}$\n;
  });

  bot.sendMessage(msg.chat.id, text);

});

/* API FOR MINI APP */

const express = require("express");
const app = express();

app.get("/courses", (req, res) => {
  res.json(db.courses);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server started"));

console.log("Bot started");