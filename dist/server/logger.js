"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const winston_1 = require("winston");
// Create log dir
const logDir = './logs';
if (!fs_1.existsSync) {
    fs_1.mkdirSync(logDir);
}
// Winston Logger Configuration
exports.logger = winston_1.createLogger({
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    defaultMeta: { service: 'ouija' },
    transports: [
        new winston_1.transports.File({ filename: logDir + '/error.log', level: 'error' }),
        new winston_1.transports.File({ filename: logDir + '/all.log' })
    ]
});
// If not in production, add debug level console transport
if (process.env.NODE_ENV !== 'production') {
    exports.logger.add(new winston_1.transports.Console({
        level: 'debug',
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple())
    }));
    exports.logger.debug({ message: 'Not in production, logging to console' });
}
//# sourceMappingURL=logger.js.map