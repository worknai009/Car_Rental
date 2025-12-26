const express = require('express');
const bodyParser = require('body-parser');
const user_routes=require('./router/user_routes');
const admin_routes=require('./router/admin_routes');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', user_routes);
app.use('/admin', admin_routes);

app.listen(1000, () => {
    console.log('Server is running on port 1000');
});

