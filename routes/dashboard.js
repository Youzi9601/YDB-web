// /home
const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('../../../Config');


// 主頁路由
router.get('*',
    (req, res, next) => {
        // session 中有 user (已登入) 或已在 '/dashboard/login'，就 next()
        if (req.session.user || req.originalUrl === '/dashboard/login') return next();
        // 反之回到登入畫面
        return res.redirect('/dashboard/login');
    },
);

router.get('/login',
    (req, res, next) => {
        // session 中沒有 user (未登入)，就 next
        if (!req.session.user) return next();
        // 反之回到控制台
        return res.redirect('/dashboard');
    },
    (req, res) => {
        return res.render('ejs/login',
            {
                layout: 'partial/home/layout.ejs',
                title: '登入 - 控制台',
                discord_auth_url: config.web.Oauth2Url,
                user: req.session.user,
                flash: req.session.flash
            })
    });

router.get('/logout',
    (req, res, next) => {
        // session 中有 user (登入)，就 next
        if (req.session.user) return next();
        // 反之回到登出畫面
        return res.redirect('/dashboard/login');
    },
    async (req, res) => {
        req.session.cookie.maxAge = 1000;
        req.session.cookie.expires = new Date(Date.now() + 1000);
        req.session.user = null;
        req.session.destroy();
        res.clearCookie();
        return res.redirect('/home')
    });

router.get('/',
    (_req, res) => {
        return res.redirect('/dashboard/servers');
    }
);

router.get('/servers', (req, res) => {
    return res.render('ejs/servers',
        {
            layout: 'partial/home/layout.ejs',
            title: '控制台',
            err: req.query.err ?? undefined,
            user: req.session.user,
            flash: req.session.flash
        })
});


module.exports = router;