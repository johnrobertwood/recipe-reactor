var fs = require('fs'),
https = require('https'),
express = require('express'),
app = express();

app.use(express.static(__dirname));

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app).listen(55555);
console.log('Server on port 55555')
