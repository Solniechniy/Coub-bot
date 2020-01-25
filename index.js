const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const Telegraf = require("telegraf");

const bot = new Telegraf(process.env.Telegram_token);

app.get("/", function(req, res) {
  bot.telegram
    .sendMessage(process.env.admin_id, ctx.message)
    .catch(err => console.log(err));
});
app.post("/", function(req, res) {
  bot.telegram
    .sendMessage(process.env.admin_id, ctx.message)
    .catch(err => console.log(err));
});
bot.use(async (ctx, next) => {
  await next();

  bot.telegram
    .sendMessage(process.env.admin_id, ctx.message)
    .catch(err => console.log(err));
  //Sending to channel
  //   bot.telegram
  //     .sendMessage(process.env.channel_id, ctx.message)
  //     .catch(err => console.log(err));
});

bot.use(ctx => {
  console.log(ctx.info);
});

bot.launch();
