import winston from 'winston';
import appRoot from 'app-root-path';

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warning: 'orange',
    info: 'green',
    http: 'magenta',
    debug: 'white'
  }
};

winston.addColors(customLevels.colors);

const transports = [];

if (process.env.NODE_ENV !== 'production') {
  transports.push(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    level: 'debug' 
  }));
}

if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: `${appRoot}/logs/errors.log`,
      level: 'error' 
    }),
    new winston.transports.File({
      filename: `${appRoot}/logs/combined.log`,
      level: 'info'
    })
  );
}

const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }), 
    winston.format.splat(),
    winston.format.json()
  ),
  transports
});

export default logger;
