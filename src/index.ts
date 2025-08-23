// import express from 'express';
// import { config } from 'dotenv';
// import { Database } from './database';
// import { routers } from './routes';
// import { redis } from './utils/redis';
// import { errorLogger, logStartup, requestLogger } from './utils';
// import { swaggerRouter } from './routes/swaggerRoutes';
// import setupSocket from "./utils/notificationSocket";

// config();



// const app = express();
// app.use((req, res, next) => {
//   requestLogger(req);
//   next();
// });
// app.use(express.json());
// app.use(swaggerRouter);

// app.use(routers);

// app.use((req, res) => {
//   res.status(404).json({
//     error: 'Not Found',
//     success: false,
//     message: 'The requested resource was not found',
//   });
// });

// redis.connect().catch((err) => errorLogger(err, 'Redis Connection'));

// const port = parseInt(process.env.PORT as string) || 5000;

// Database.database
//   .authenticate()
//   .then(async () => {
//     try {
//       app.listen(port, () => {
//         logStartup(port, process.env.NODE_ENV || 'DEV');
//       });
//     } catch (error) {
//       errorLogger(error as Error, 'Server Startup');
//     }
//   })
//   .catch((error) => {
//     errorLogger(error as Error, 'Database Connection');
//   });

// export { app };


import express from 'express';
import { config } from 'dotenv';
import { Database } from './database';
import { routers } from './routes';
import { redis } from './utils/redis';
import { errorLogger, logStartup, requestLogger } from './utils';
import { swaggerRouter } from './routes/swaggerRoutes';
import { initCronJobs } from './cron';
import setupSocket from "./utils/notificationSocket"; 
import { createServer } from 'http';
import { Server } from "socket.io";

config();

const app = express();

app.use((req, res, next) => {
  requestLogger(req);
  next();
});
app.use(express.json());
app.use(swaggerRouter);
app.use(routers);

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    success: false,
    message: 'The requested resource was not found',
  });
});

redis.connect().catch((err) => errorLogger(err, 'Redis Connection'));

const port = parseInt(process.env.PORT as string) || 5000;

// 1. Create raw HTTP server
const server = createServer(app);

// 2. Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*', // or use your allowedOrigins variable
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 3. Pass io into setupSocket
setupSocket(io);

// 4. Listen on server
Database.database
  .authenticate()
  .then(async () => {
    try {
      initCronJobs();
      app.listen(port, () => {
      server.listen(port, () => {
        logStartup(port, process.env.NODE_ENV || 'DEV');
      });
    } catch (error) {
      errorLogger(error as Error, 'Server Startup');
    }
  })
  .catch((error) => {
    errorLogger(error as Error, 'Database Connection');
  });

export { app, server, io };
