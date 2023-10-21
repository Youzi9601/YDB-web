const express = require('express');
const router = express.Router();
const { request } = require("undici");
const config = require('../../../Config')
// home
router.get('/discord', async (req, res) => {
    // console.log(req)
    const { code, state } = req.query;
    // client.console('Log',req.body)
    // console.log(code)
    let userdata = {};

    if (code) {
        try {
            // 第一次接受授權

            const [fullUrl, _] = getUrl(req)

            // console.log(fullUrl)
            const user_tokenResponseData = await request(
                "https://discord.com/api/oauth2/token",
                {
                    method: "POST",
                    body: new URLSearchParams({
                        client_id: config.global.discord.clientID,
                        client_secret: config.global.discord.clientSECRET,
                        code,
                        grant_type: "authorization_code",
                        // 抓資料回來這邊
                        redirect_uri: fullUrl,
                        scope: "identify",
                    }).toString(),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            );
            const user_oauthData = await user_tokenResponseData.body.json();
            // console.log(user_oauthData)
            // 取得使用者資料
            userdata = await userDiscordinfo(undefined, user_oauthData.access_token);
            if ((userdata.message && userdata.code == 0) || (!user_oauthData.access_token || !user_oauthData.refresh_token)) throw "401: Unauthorized";
            // console.log(userdata)
            // 處理資料
            req.session.cookie.expires = new Date(Date.now() + 604800);
            req.session.cookie.maxAge = 604800;
            req.session.user = userdata;

            req.session.flash = {
                message: `歡迎 ${ userdata.username }`, //將 flash 寫入 session
                loginSuccess: true
            }
            // return res.redirect('/')

            // 儲存 token 資料(並轉為base64)
            // console.log(user_oauthData)
            res.cookie('access_token', btoa(user_oauthData.access_token), { expires: new Date(Date.now() + 604800) }); // 7天
            res.cookie('refresh_token', btoa(user_oauthData.refresh_token), { expires: new Date(Date.now() + 604800) }); // 7天
            res.cookie('oauth-state', btoa(state), { expires: new Date(Date.now() + 604800) }); // 7天

        } catch (error) {
            // NOTE: 未經授權的令牌不會拋出錯誤
            // tokenResponseData.statusCode will be 401

            req.session.flash = {
                message: `登入失敗：無法驗證`, //將 flash 寫入 session
                loginSuccess: false
            }
            console.error(error)
            return res.status(401).send("/home?err=code401");
        }
        if (req.cookies?.redirect) {
            return res.send(req.cookies.redirect);
        }
        return res.render('ejs/login', {
            layout: 'partial/home/layout.ejs',
            title: '成功登入 - 控制台',
            discord_auth_url: config.web.Oauth2Url,
            user: req.session.user,
            flash: req.session.flash
        });
        //TO-DO: 製作登入彈窗。
    } else {
        return res.status(401).send("/home?err=noData");
    }
});
router.get('/urls', async (req, res) => {
    const [_, fullUrl] = getUrl(req);
    const data = {
        discordAuthUrl: `https://discord.com/api/oauth2/authorize?client_id=${ config.global.discord.clientID }&redirect_uri=${ encodeURIComponent(fullUrl + "/auth/discord") }&response_type=code&scope=identify%20email`
    };
    return res.send(data);
});

// 404 問題
router.use((_req, res, _next) => {
    return res.status(404).send('未知的位置')
});

module.exports = router;


/**
 * 取得成員資料
 * @param {String} token_type
 * @param {String} access_token
 * @returns {Promise<any>} 使用者資料
 */
async function userDiscordinfo(token_type = 'Bearer', access_token) {
    const userResult = await request(
        "https://discord.com/api/users/@me",
        {
            headers: {
                authorization: `${ token_type } ${ access_token }`,
            },
        },
    );
    return await userResult.body.json();
}
/**
 * 取得成員伺服器資料
 * @param {String} token_type
 * @param {String} access_token
 * @returns {Promise<any>} 使用者資料
 */
async function userGuildsDiscordinfo(token_type = 'Bearer', access_token) {
    const guildsResult = await request(
        "https://discord.com/api/users/@me/guilds",
        {
            headers: {
                authorization: `${ token_type } ${ access_token }`,
            },
        },
    );
    return await guildsResult.body.json();
}

function getUrl(req) {
    // 組合主機、協議和路徑以獲取完整url
    const forwardedHost = req.headers['x-forwarded-host'];
    const forwardedProto = req.headers['x-forwarded-proto'];
    const originalUrl = req.originalUrl.split('?')[0];
    const host = forwardedHost || req.get('host');
    const protocol = forwardedProto || req.protocol;
    return [`${ protocol }://${ host }${ originalUrl }`, `${ protocol }://${ host }`];

}