var express = require('express'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    cors = require('cors'),
    path = require('path'),
    timestamp = require('log-timestamp'),
    app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(compression());

app.get('/api', function (req, res) {
    res.send('Mock APIs are running');
});

app.get('/getCards', function (req, res) {
    console.log('getCards service was called');

    var obj = require("./data/getCards.json");

    res.json(obj);
});

app.get('/getCardTransactions/:id', function (req, res) {
    var cardId = req.params.id;

    console.log('getCardTransactions service was called for card ' + cardId);

    if (cardId == "R0FrNXfM") {
        var obj = require("./data/card1.json");
    } else if (cardId == "fggd4GY0") {
        var obj = require("./data/card2.json");
    } else if (cardId == "fSSWUe7d") {
        var obj = require("./data/card3.json");
    } else if (cardId == "mGkU6KMe") {
        var obj = require("./data/card4.json");
    } else {
      res.status(400);
      return res.json({
        "error": "Invalid card id"
      });
    }

    res.json(obj);
});

app.get('/getLimit', function (req, res) {
    console.log('getLimit service was called');

    var obj = require("./data/getLimit.json");

    res.json(obj);
});

app.get('/setLimit', function (req, res) {
    console.log('setLimit service was called');

    res.json({
        "status": "ok"
    });
});

app.get('/getMessages', function (req, res) {
    console.log('getMessages service was called');

    var obj = require("./data/getMessages.json");

    res.json(obj);
});


app.listen(5678, function(){
    console.log('Mock server listening on port 5678');
});