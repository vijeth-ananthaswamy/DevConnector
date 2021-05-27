const express = require('express');

const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const userRoutes = require('./routes/api/users');
const authRoutes = require('./routes/api/auth');
const profileRoutes = require('./routes/api/profile');
const postsRoutes = require('./routes/api/posts');

const app = express();

//Init bodyparser middleware
app.use(express.json({extended:false}));

//Connect to database
connectDB();

app.get('/', (req, res) => {
  res.send('API started');
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);

app.listen(PORT, () => {
  console.log('Server started on port ', PORT);
});
