const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.port || 3200

app.listen(PORT, () => {
  console.log(`The server is listeniing on port ${PORT}`);
})

mongoose.connect(process.env.MONGO_DB_URI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true
}, (err) => {
    if (err) throw err;
  console.log(`MongoDB connection established`)
});

const userRouter = require('./routes/user.router');

app.use('/users', userRouter);