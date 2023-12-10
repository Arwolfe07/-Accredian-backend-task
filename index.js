if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');


const app = express();

app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use('/', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server is running on PORT: ', PORT);
})

