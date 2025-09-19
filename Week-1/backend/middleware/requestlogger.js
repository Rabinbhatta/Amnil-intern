import logger from "../logs/logger.js";

const requestLogger = (req, res, next) => {
  const { method, originalUrl, body } = req;

  logger.info(`HTTP ${method} ${originalUrl} - Body: ${JSON.stringify(body)}`);

  // You can also log headers if needed (careful with sensitive info)
  // logger.debug(`Headers: ${JSON.stringify(req.headers)}`);

  next();
};

export default requestLogger;
