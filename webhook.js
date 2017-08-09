const express = require('express');
const middleware = require('@line/bot-sdk').middleware;
const Client = require('@line/bot-sdk').Client;
const bodyParser = require('body-parser');

const app = express();

const config = {
  channelAccessToken: 'Aewq2lkqZvmE/54OzmL7J0IUUdw7GRHCW1Bqxj0VKvB1D2CQcZVjKCDj6Eyi13cNVpI9x+KRnNa00cUrWW8cmQgrjx/Q7FzfOqDxwNuUHgfZuUm+0qu63294G79KOc0cFG2UenM1yjxLPmchGkU1CgdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'b712a0d41b0373f21b18bff87a5ee97d'
};

const client = new Client({
  channelAccessToken: 'Aewq2lkqZvmE/54OzmL7J0IUUdw7GRHCW1Bqxj0VKvB1D2CQcZVjKCDj6Eyi13cNVpI9x+KRnNa00cUrWW8cmQgrjx/Q7FzfOqDxwNuUHgfZuUm+0qu63294G79KOc0cFG2UenM1yjxLPmchGkU1CgdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'b712a0d41b0373f21b18bff87a5ee97d'
});

app.use(middleware(config));
app.use(bodyParser.json());

const server = app.listen(5000, () => {
  console.log('Listening on port ' + server.address().port);
});

app.post('https://ngavinsir-bot.herokuapp.com/webhook', (req,res) => {
  res.status(200).send(req.body);
  console.log(req.body.events[0]);
  if(req.body.events[0].type === 'message')
  {
    if(req.body.events[0].message.type === 'text')
    {
      const msg = req.body.events[0].message;
      console.log(msg.text);
      client.replyMessage(req.body.events[0].replyToken, { type: 'text', text: 'gak usah sok-sok ' + msg.text + ' ngentot!'});
      return;
    }
  }
});
