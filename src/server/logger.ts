import * as fs from 'fs';
import { createLogger, format, transports } from 'winston';

const logDir = './logs';
if (!fs.existsSync) {
    fs.mkdirSync(logDir);
}
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
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({ level: 'debug', format: format.combine(format.colorize(), format.simple()) }));
    logger.debug({ message: 'Not in production, logging to console' });
}
