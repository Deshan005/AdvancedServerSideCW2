const express = require('express');
const cors=require('cors');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const blogRouter = require('./routes/posts');
const followRouter=require('./routes/followRouter');
const likeCommentRouter = require('./routes/likeCommentRouter');

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:5173",
      allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
      credentials: true,
    })
  );

app.use('/uploads', express.static('uploads'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use("/auth", authRoutes);
app.use("/blog", blogRouter);
app.use('/user', followRouter);
app.use('/blog', likeCommentRouter);

app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}..`);
});
