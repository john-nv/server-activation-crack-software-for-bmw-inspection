const mongoose = require('mongoose')
const express = require('express')
const app = express()
require('dotenv').config();

const db = require('./config/database/mongo')
const adminControllers = require('./controllers/account.controller');
const router = require('./routers');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

router(app)
db.connect()
adminControllers.initAccount()

const PORT = process.env.PORT || 3203;
app.listen(PORT, () => {
    console.log(`start server => http://localhost:${PORT}`);
});