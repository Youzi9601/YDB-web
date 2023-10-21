//#region 連線道伺服器

const { Client: HostClient } = require('discord-cross-hosting');
const config = require('./Config');

// 與 Host 連線
const hostclient = new HostClient({
    agent: config.web.agent,
    authToken: config.global.authToken,
    host: config.hosting.host,
    port: config.hosting.port,
});
hostclient
    .on('debug', m =>
        config.global.logLevel.debug ?
            console.debug(m)
            : ''
    )
    .on('ready', async d => {
        console.log(`已成功連線！註冊名稱為 ${ d.id } `)
        if (process.send)
            process.send('ready');
    });

// 連線
hostclient
    .connect()
    .then(async (hc) => {
        console.log(`WEB | 已連接到伺服器，延遲：${ await hc.ping() }ms`);
    });
//#endregion

//#region 網頁
const express = require('express');
const session = require('express-session');
const sqlite = require("better-sqlite3");
const cookieParser = require('cookie-parser');
const SqliteStore = require("better-sqlite3-session-store")(session)
const session_db = new sqlite("Storges/Client/sessions.sqlite");

const app = express();
const port = config.web.port;

// 設定 EJS 為視圖引擎
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.use(require('express-ejs-layouts'));
app.use(cookieParser());
app.use(
    session({
        secret: `${ new Date().toDateString }`,
        name: "user", // optional
        saveUninitialized: true,
        resave: false,
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
        store: new SqliteStore({
            client: session_db,
            expired: {
                clear: true,
                intervalMs: 15 * 60 * 1000 //ms = 15min
            },
        }),
    }),
);
// 設定伺服器路由
app.use((req, res, next) => {
    res.locals.flash = req.session.flash;
    next();
})
// 路由
app.use('/home', require('./routes/home'));
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));

// 設定基本網站進入時重導向到主頁
app
    .get('', (req, res) => {
        return res.redirect('/home')
    })
    .get('/', (req, res) => {
        return res.redirect('/home')
    });

// 啟動伺服器
app.listen(port, async () => {
    console.log(`應用程式正在運行，位於 http://${ config.web.host }:${ config.web.port }`);
});


//#endregion