const express = require("express"),
  bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv").config();
const Telegraf = require("telegraf");
const { Extra, Markup } = require("telegraf");
const port = process.env.PORT || 3010;
const bot = new Telegraf(process.env.Telegram_token);

const axios = require("axios");
const TelegrafInlineMenu = require("telegraf-inline-menu");

let store = [],
  tempObj = 0;

const menu = new TelegrafInlineMenu(ctx => `Hey ${ctx.from.first_name}!`);

const keyboard = Markup.inlineKeyboard([
  Markup.callbackButton("No", "skip"),
  Markup.callbackButton("Yes", "send")
]);

bot.start(async ctx => {
  try {
    await updateStore();
  } catch (err) {
    console.log(err);
  }
  console.log("store updated");
  ctx.reply(store[0].file_versions.share.default, Extra.markup(keyboard));
});

bot.action("send", async ctx => {
  bot.telegram
    .sendMessage(
      process.env.channel_id,
      store[tempObj].file_versions.share.default
    )
    .catch(err => console.log(err));
  if (tempObj < store.length - 1) {
    ctx.reply(
      store[tempObj + 1].file_versions.share.default,
      Extra.markup(keyboard)
    );
    tempObj++;
  } else {
    await updateStore();
  }
});

bot.action("skip", async ctx => {
  if (tempObj < store.length - 1) {
    ctx.reply(
      store[tempObj + 1].file_versions.share.default,
      Extra.markup(keyboard)
    );
    tempObj++;
  } else {
    await updateStore();
  }
});

function updateStore() {
  return axios
    .get(
      "https://coub.com/api/v2/timeline/hot?order_by=oldestaccess_token=6896dc88deac24b1c897732f6782b54499c59f0d08d6e158ee0fd90b22dae264&page=1&per_page=25"
    )
    .then(json => (store = json.data.coubs));
}

// bot.use(async (ctx, next) => {
//   await next();

//   if (ctx.message.from.id === 282113996) {
//     bot.telegram
//       .sendMessage(
//         process.env.admin_id,
//         "Приветствую хозяин, сейчас подберу пару видосиков для тебя"
//       )
//       .catch(err => console.log(err));

//     await ctx
//       .editMessageReplyMarkup({
//         inline_keyboard: [
//           [
//             {
//               text: "Board Rotation",
//               callback_data: "settings::rotation"
//             }
//           ],
//           [
//             {
//               text: "⬅️ Back to game",
//               callback_data: "back"
//             }
//           ]
//         ]
//       })
//       .catch(debug);
//     return ctx.answerInlineQuery("Please choose a setting you want to change!");
//   } else {
//     bot.telegram
//       .sendMessage(
//         process.env.admin_id,
//         `${
//           ctx.message.from.username
//             ? ctx.message.from.username
//             : ctx.message.from.id
//         } написал ${cxt.message.text}`
//       )
//       .catch(err => console.log(err));
//   }

// Sending to channel
// bot.telegram
//   .sendMessage(process.env.channel_id, ctx.message)
//   .catch(err => console.log(err));
// });

// bot.use(ctx => {
//   console.log(ctx.info);
// });

// app.get("/oauth/redirect", (req, res) => {
//   // The req.query object has the query params that
//   // were sent to this route. We want the `code` param
//   const requestToken = req.query.code;
//   axios({
//     // make a POST request
//     method: "post",
//     // to the Github authentication API, with the client ID, client secret
//     // and request token
//     url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
//     // Set the content type header, so that we get the response in JSOn
//     headers: {
//       accept: "application/json"
//     }
//   }).then(response => {
//     // Once we get the response, extract the access token from
//     // the response body
//     const accessToken = response.data.access_token;
//     // redirect the user to the welcome page, along with the access token
//     res.redirect(`/welcome.html?access_token=${accessToken}`);
//   });
// });

// app.get("/", function(req, res) {
//   res.send(`  <a
//   href="http://coub.com/oauth/authorize?response_type=code&client_id=0e74713e44c764ab1c732edbe7aa7773e6eab422653f22faee4a376e5f4aca87&redirect_uri=https://coub-telegram-bot.herokuapp.com/callback"
// >
//   Login with coub
// </a>`);

//   console.log(req.body);
//   console.log(req.query);
//   //   bot.telegram
//   //     .sendMessage(process.env.admin_id, req.body)
//   //     .catch(err => console.log(err));
//   //   bot.telegram
//   //     .sendMessage(process.env.admin_id, req.query)
//   //     .catch(err => console.log(err));
// });

// app.get("/post token", function(req, res) {
//   res.send("query" + req.query);

//   console.log(req.body);
//   console.log(req.query);
//     bot.telegram
//       .sendMessage(process.env.admin_id, req.body)
//       .catch(err => console.log(err));
//     bot.telegram
//       .sendMessage(process.env.admin_id, req.query)
//       .catch(err => console.log(err));
// });

// app.post("/", function(req, res) {
//   bot.telegram
//     .sendMessage(process.env.admin_id, "hello from post")
//     .catch(err => console.log(err));
// });

app.listen(port, () => console.log(`listening on port ${port}!`));

bot.startPolling();
bot.launch();
