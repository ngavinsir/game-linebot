const express = require('express'); //get express object
const middleware = require('@line/bot-sdk').middleware; //middleware from line to authorize line token
const Client = require('@line/bot-sdk').Client; //line client
const bodyParser = require('body-parser'); //for json

var gindex = 0; //games number
var ggames = {}; //games storage

var ggame = function(name) //generate new game
{
  this.name = name;
  this.nid = gindex;
  ggames[gindex] = this;
  gindex++;
};


ggame.prototype = //game functions
{
  getName : function() //return the name of the game
            {
              return (this.nid + " - " + this.name);
            }
};

console.log(new ggame("hey").getName() + "\n" + new ggame("sup").getName() + "\n" + ggames[0].getName());

const app = express();

const config = {
  channelAccessToken: 'Aewq2lkqZvmE/54OzmL7J0IUUdw7GRHCW1Bqxj0VKvB1D2CQcZVjKCDj6Eyi13cNVpI9x+KRnNa00cUrWW8cmQgrjx/Q7FzfOqDxwNuUHgfZuUm+0qu63294G79KOc0cFG2UenM1yjxLPmchGkU1CgdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'b712a0d41b0373f21b18bff87a5ee97d'
};

const client = new Client({
  channelAccessToken: 'Aewq2lkqZvmE/54OzmL7J0IUUdw7GRHCW1Bqxj0VKvB1D2CQcZVjKCDj6Eyi13cNVpI9x+KRnNa00cUrWW8cmQgrjx/Q7FzfOqDxwNuUHgfZuUm+0qu63294G79KOc0cFG2UenM1yjxLPmchGkU1CgdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'b712a0d41b0373f21b18bff87a5ee97d'
});

app.use(middleware(config)); //before the bodyparser.json for line authorization
app.use(bodyParser.json()); //for json

const server = app.listen(process.env.PORT || 5000, () => { //opening the server on any port or 5000
  console.log('Listening on port ' + server.address().port);
});

app.post('/', (req,res) => { //what to do in case a http post
  res.status(200).send(req.body);
  const ei = req.body.events[0];
  console.log(ei);
  if(ei.type === 'message')
  {
    if(ei.message.type === 'text')
    {
      const msg = ei.message;
      if(msg.text === 'bye ngentott') //to make the bot leaves
      {
        client.replyMessage(ei.replyToken, { type: 'text', text: 'jangan kangen aku yaahh!!'});
        if(ei.source.type === 'room')
        {
          client.leaveRoom(ei.source.roomId);
        }
        return;
      }
      if(msg.text.startsWith("g "))
      {
        ggames[ei.source.userId] = msg.text.substring(2, msg.text.length);
        client.replyMessage(ei.replyToken, { type: 'text', text: (msg.text.substring(2, msg.text.length))});
        return;
      }
      console.log(msg.text);
      client.replyMessage(req.body.events[0].replyToken,
        { type: 'text', text: 'gak usah sok-sok ' + msg.text + ' ngentot!'});
      return;
    }
  }
});
