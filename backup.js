const spwan = require('child_process').spawn;
const https = require('http');
const url = require('url');
const fs = require('fs');
const pyLibs = require('./installPythonLibs');
var express = require('express');
var app = express();

app.set('views', './views');
app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => { res.render('chat.html') });

app.get('/suggestion', (req, res) => {
    const pythonProcess1 = spwan('python', ["communityTest.py"]);
    pythonProcess1.stdout.on('data', (data) => {
        res.write(data);
        res.end();
    });
});

app.get('/:d', function (req, res, next) {
    console.log(req.params.d);
    fs.readFile(req.params.d, 'utf8', function (err, result) {
        if (err) next();
        else {
            res.writeHead(200);
            res.write(result);
            res.end();
        }
    });
});

app.get('*', function (req, res) {
    res.send("Invalid request");
});


const startup = async () => {
    try {
        await pyLibs();
        app.listen(process.env.PORT || 9696, (err) => console.log('\nInitial setup done.\nOpen http://localhost:9696 in browser.'));
    } catch (err) {
        console.log('Initial setup failed.', err);
    }
}


startup();