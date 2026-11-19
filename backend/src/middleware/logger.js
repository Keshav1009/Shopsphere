// Real-time Console & HTTP Request Logger
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const color =
      statusCode >= 500 ? '\x1b[31m' : // Red
      statusCode >= 400 ? '\x1b[33m' : // Yellow
      statusCode >= 300 ? '\x1b[36m' : // Cyan
      '\x1b[32m'; // Green
    const reset = '\x1b[0m';

    console.log(
      `[${new Date().toISOString()}] ${color}${method}${reset} ${originalUrl} ${color}${statusCode}${reset} - ${duration}ms (${ip})`
    );
  });

  next();
};

module.exports = requestLogger;
