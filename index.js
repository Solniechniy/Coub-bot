const express = require("express"),
  bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv").config();
const Telegraf = require("telegraf");
const port = process.env.PORT || 3000;
const bot = new Telegraf(process.env.Telegram_token);

app.use(bodyParser.urlencoded({ extended: true }));

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
app.get("/", function(req, res) {
  res.send("hello world");

  console.log(req.body);
  console.log(req.query);
  console.log(req.body.email);
  bot.telegram
    .sendMessage(process.env.admin_id, req.body)
    .catch(err => console.log(err));
  bot.telegram
    .sendMessage(process.env.admin_id, req.query)
    .catch(err => console.log(err));
});
app.post("/", function(req, res) {
  bot.telegram
    .sendMessage(process.env.admin_id, "hello from post")
    .catch(err => console.log(err));
});

app.listen(port, () => console.log(`listening on port ${port}!`));
