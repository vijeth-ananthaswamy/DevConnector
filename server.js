const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const PORT = process.env.PORT || 5000;

const userRoutes = require('./routes/api/users');
const authRoutes = require('./routes/api/auth');
const profileRoutes = require('./routes/api/profile');
const postsRoutes = require('./routes/api/posts');

const app = express();

//Init bodyparser middleware
app.use(express.json({ extended: false }));

//Connect to database
connectDB();

//Define routes:
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);

//Serve static assets in Production
if (process.env.NODE_ENV === 'production') {
  //Set a static folder and we are setting up index.html file
  //inside client/build folder to be the static file
  app.use(express.static('client/build'));

  app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log('Server started on port ', PORT);
});
