const https = require('https');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const danfy = require('./danfy-server/router');
const notify = require('./notify-server/router');
const clientCheck = require('./client-check/router');
const { SSL } = require('./danfy-server/dist/services/ssl');
const { execSync } = require('child_process');
const bodyParser = require('body-parser');

const secret = require('./secret.json').s;

const app = express();

app.options('*', cors());
app.use(cors());
app.use(bodyParser.json());

app.use('/danfy', danfy.app);
app.use('/notify', notify.app);
app.use('/cc', clientCheck.app);

const sigHeaderName = 'X-Hub-Signature';

function verifyPostData(req, res, next) {
  const payload = JSON.stringify(req.body);
  if (!payload) {
    return next('Request body empty');
  }

  const hmac = crypto.createHmac('sha1', secret);
  const digest = 'sha1=' + hmac.update(payload).digest('hex');
  const checksum = req.get(sigHeaderName);
  if (!checksum || !digest || checksum !== digest) {
    return next(`Request body digest (${digest}) did not match ${sigHeaderName} (${checksum})`);
  }
  return next();
}

app.post('/update', verifyPostData, (req, res) => {
	const { head_commit } = req.body;
	const { author, message } = head_commit; 
	const { username } = author;
	
	if (username === 'gabrielcarneiro97' && message.includes('!update')) {
		console.log("updating!");
		res.sendStatus(202);
		execSync('./tmux-update.sh');
	} else res.sendStatus(200);
});

https.createServer(SSL, app).listen(8080, () => {
	console.log('SSL server listening 8080 port');
});
