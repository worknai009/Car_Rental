const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const user_routes=require('./Controller/user_routes');
const admin_routes=require('./Controller/admin_routes');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const multer = require('multer');
const path=require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static("public")); // for uploaded images
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', user_routes);
app.use('/admin', admin_routes);

app.listen(1000, () => {
    console.log('Server is running on port 1000');
});


