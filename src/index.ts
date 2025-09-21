import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from 'router';
const app = express();

app.use(cors({
    credentials: true
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
});

const mongo_url = 'mongodb+srv://darshan4295:becool4295@cluster0.1l7gxhz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.Promise = Promise;
mongoose
  .connect(mongo_url)
  .then(result => {
    console.log('Connected to MongoDB successfully');
    // REMOVED: app.listen(80); - This was causing the issue
  })
  .catch(err => {
    console.log('MongoDB connection error:', err);
  });

console.log('Darshan hande');
mongoose.connection.on('error', (error) => console.log('MongoDB error:', error));

app.use('/', router()); // Make sure your router function exists and returns a router