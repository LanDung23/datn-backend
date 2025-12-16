const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan')
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 5001;
const db = require('./src/models/index');
const api = require('./src/routes/index');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));


app.use(cors());
app.use(morgan('dev'))
app.use('/api', api)

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})