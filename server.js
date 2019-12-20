const https = require('https');
const express = require('express');
const cors = require('cors');
const danfy = require('./danfy-server/router');
const notify = require('./notify-server/router');
const clientCheck = require('./client-check/router');
const { SSL } = require('./danfy-server/dist/services/ssl');

const app = express();

app.options('*', cors());
app.use(cors());

app.use('/danfy', danfy.app);
app.use('/notify', notify.app);
app.use('/cc', clientCheck.app);

https.createServer(SSL, app).listen(8080, () => {
	console.log('SSL server listening 8080 port');
});
