import 'reflect-metadata'; // Must be first import
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import ErrorHandler from './middlewares/ErrorHandlerx';
import { container } from './container'; // Initialize DI container
import { TYPES, ILogger } from './types/service-types';

// Get logger from DI container
const logger = container.get<ILogger>(TYPES.Logger);

const app = express();

app.use(cors({
    credentials: true
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    logger.info("Server running on http://localhost:8080");
});

const mongo_url = 'mongodb+srv://darshan4295:becool4295@cluster0.1l7gxhz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.Promise = Promise;
mongoose
  .connect(mongo_url)
  .then(result => {
    logger.info('Connected to MongoDB successfully');
  })
  .catch(err => {
    logger.error(`MongoDB connection error: ${err.message}`);
  });

logger.info('Darshan hande - Application starting with InversifyJS DI');
mongoose.connection.on('error', (error) => logger.error(`MongoDB error: ${error.message}`));

app.use('/', router());

app.use(ErrorHandler);