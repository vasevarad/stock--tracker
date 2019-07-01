const express = require('express');
const connectDB = require('./config/db');

const app =  express();

//connect database
connectDB();

//init middleware
app.use(express.json({extended: false}));

app.get('/', (req, res) => res.send('API Running!'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/stocks', require('./routes/api/stocks'));
app.use('/api/stocks/buy', require('./routes/api/stocks'));

app.use('/api/balance', require('./routes/api/balance'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server started on port ${PORT}'));