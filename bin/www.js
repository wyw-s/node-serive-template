#!/usr/bin/env node

const app = require('../app');
const http = require('http');
const initApp = require('../config/init');
const fileLogger = require('../utils/FileLogger');

async function startApp() {
  const { YW_PORT, YW_HOSTNAME } = process.env;

  await initApp();

  const port = normalizePort(YW_PORT || '3000');
  const server = http.createServer(app.callback());

  function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        fileLogger.error(`${bind} + ' is already in use'. Program interruptions`)
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  function onListening() {
    const addr = server.address();
    fileLogger.info(`服务启动成功, 请访问: http://${ addr.address }:${ addr.port }`)
  }

  server.listen(port, YW_HOSTNAME);
  server.on('error', onError);
  server.on('listening', onListening);
}

startApp();

