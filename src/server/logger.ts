import { existsSync, mkdirSync } from 'fs';
import { createLogger, format, transports } from 'winston';

// Create log dir
const logDir = './logs';
if (!existsSync) {
    mkdirSync(logDir);
}

// Winston Logger Configuration
export const logger = createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'ouija' },
    transports: [
        new transports.File({ filename: logDir + '/error.log', level: 'error' }),
        new transports.File({ filename: logDir + '/all.log' })
    ]
});

// If not in production, add debug level console transport
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new transports.Console({
            level: 'debug',
            format: format.combine(format.colorize(), format.simple())
        })
    );
    logger.debug({ message: 'Not in production, logging to console' });
}
