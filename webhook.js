const express = require('express'); //get express object
const middleware = require('@line/bot-sdk').middleware; //middleware from line to authorize line token
const Client = require('@line/bot-sdk').Client; //line client
const bodyParser = require('body-parser'); //for json

var gindex = 0; //games number
var ggames = {}; //games storage

var ggame = function(id) //generate new game
{
  this.rid = id;
  this.nid = gindex;
  this.players = {};
  this.pcount = 0;
  ggames[gindex] = this;
  ggames[this.rid] = this;
  gindex++;
};

var ppl = function(uid)
{
  this.uid = uid;
  client.getProfile(uid).then((profile) =>
  {
    this.name = profile.displayName;
    console.log(this.name);
  });
}

ggame.prototype = //game functions
{
  getId : function() //return the name of the game
          {
              return this.rid;
          },
  addPlayer : function(uid)
          {
            this.players[this.pcount] = new ppl(uid);
            this.players[uid] = this.players[this.pcount];
            console.log(this.players[this.pcount].uid);
            console.log(this.pcount);
            this.pcount++;
          }
};

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
  res.status(200).send('$');
  const ei = req.body.events[0];
  console.log(ei);
  if(ei.type === 'message')
  {
    if(ei.message.type === 'text')
    {
      handleMsg(ei);
      return;
    }
  }
  if(ei.type === 'join')
  {
    reply(ei.replyToken, 'Ketik !mulai untuk memulai permainan.');
    return;
  }
});

function handleMsg(ei)
{
  const msg = ei.message.text;

  /*
-------------------------------------------------------------------------------------------------------------
  */
  if(msg === '!mulai')
  {
    if(getRoom(ei) == null)
    {
      return;
    }
    if(isGame(ei))
    {
      reply(ei.replyToken, 'Permainan sedang berjalan.');
      return;
    }
    var ff = setTimeout(function()
    {
      if(getGame(ei) != null)
      {
        return;
      }
      var g = new ggame(getRoom(ei));
      g.addPlayer(ei.source.userId);
      reply(ei.replyToken, '1 menit hingga permainan dimulai\n\n Ketik !gabung untuk ikut bermain\n' + g.pcount
        + ' pemain sudah bergabung');
      return;
    }, 2000);
    client.pushMessage(ei.source.userId, {type: 'text', text: 'Anda bergabung dengan permainan.'})
    .catch((err) =>
    {
      clearTimeout(ff);
      client.getProfile(ei.source.userId)
      .then((profile) =>
      {
        reply(ei.replyToken, profile.displayName + ' belum menambahkan saya menjadi teman.')
      });
      return;
    });
  }

  /*
-------------------------------------------------------------------------------------------------------------
  */

  if(msg === '!gabung')
  {
    if(isGame(ei))
    {
      if(getGame(ei).players[ei.source.userId] != null)
      {
        reply(ei.replyToken, getPpl(ei.source.userId).name
          + " sudah bergabung dengan permainan! Tunggu hingga permainan dimulai");
        return;
      }
      var ff = setTimeout(function()
      {
        if(getGame(ei) == null)
        {
          return;
        }
        getGame(ei).addPlayer(ei.source.userId);
        reply(ei.replyToken, getPpl(ei.source.userId).name
          + ' telah bergabung dengan permainan\n\n Ketik !gabung untuk ikut bermain\n' + g.pcount
          + ' pemain sudah bergabung');
        return;
      }, 2000);
      client.pushMessage(ei.source.userId, {type: 'text', text: 'Anda bergabung dengan permainan.'})
      .catch((err) =>
      {
        clearTimeout(ff);
        client.getProfile(ei.source.userId)
        .then((profile) =>
        {
          reply(ei.replyToken, profile.displayName + ' belum menambahkan saya menjadi teman.')
        });
        return;
      });
      return;
    }
    reply(ei.replyToken, 'Ketik !mulai terlebih dahulu untuk membuat permainan.');
  }

  /*
-------------------------------------------------------------------------------------------------------------
  */

  if(msg === '!pemain')
  {
    if(isGame(ei))
    {
      var gg = getGame(ei);
      var txt = '';
      for(i = 0; i < gg.pcount; i++)
      {
        if(i != 0)
        {
          txt += '\n';
        }
        txt += (i+1) + '. ' + gg.players[i].name;
      }
      if(txt != '')
      {
        reply(ei.replyToken, txt);
      }
      return;
    }
  }

  /*
-------------------------------------------------------------------------------------------------------------
  */
}

function isGame(ei)
{
  return ((getRoom(ei) != null) && (getGame(ei) != null));
}

function reply(token, msg)
{
  client.replyMessage(token, {type: 'text', text: msg});
  return;
}

function getGame(ei)
{
  if(isGame(ei))
  {
    return ggames[getRoom(ei)];
  }
  return null;
}

function getPpl(uid)
{
  return getGame(ei).players[ei.source.userId];
}

function getRoom(ei)
{
  if(ei.source.type === 'room')
  {
    return ei.source.roomId;
  }
  if(ei.source.type === 'group')
  {
    return ei.source.groupId;
  }
  return;
}

function getP(ei)
{
  return client.getProfile(ei.source.userId).catch((err) =>
  {
    console.log('fucked');
  });
}
