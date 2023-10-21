// 取得 process.env 資料
require('dotenv').config();
let config
try {
    config = require('./../../Config');
} catch (error) {
    config = {
        global: {
            authToken: process.env.hosting_authToken,
            discord: {
                token: process.env.discord_token,
                clientID: process.env.discord_clientID,
                clientSECRET: process.env.discord_clientSECRET,
            },
            logLevel: {
                debug: true,
                error: true,
                warn: true,
                info: true,
                log: true,
            }
        },
        hosting: {
            host: process.env.hosting_host || "localhost",
            port: Number(process.env.hosting_port || 4444),
            totalMachines: 4,
            totalShards: 20,
            shardsPerCluster: 4,
        },
        web: {
            agent: 'dashboard',
            host: process.env.web_host || 'localhost',
            port: Number(process.env.web_port || 3000),
        },
    };
}
module.exports = config;