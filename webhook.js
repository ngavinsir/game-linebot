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

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Listening on port ' + server.address().port);
});

app.post('/', (req,res) => {
  res.status(200).send(req.body);
  const ei = req.body.events[0];
  console.log(ei);
  if(ei.type === 'message')
  {
    if(ei.message.type === 'text')
    {
      const msg = ei.message;
      if(msg.text === 'bye ngentott')
      {
        client.replyMessage(ei.replyToken, { type: 'text', text: 'jangan kangen aku yaahh!!'});
        if(ei.source.type === 'room')
        {
          client.leaveRoom(ei.source.roomId);
        }
        return;
      }
      console.log(msg.text);
      client.replyMessage(req.body.events[0].replyToken,
        { type: 'text', text: 'gak usah sok-sok ' + msg.text + ' ngentot!'});
      return;
    }
  }
});
