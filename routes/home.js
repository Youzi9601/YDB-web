const express = require('express');
const router = express.Router();
// const statistics_db = require('../../Helpers/database')('Client/status', { table: 'statistics' });

// home
router.get('/', async (req, res) => {
    const { total } = require('./../App');
    // console.log(req.session);
    console.log(req.session.user);
    if (req.session.user?.message && req.session.user.message == '401: Unauthorized')
        req.session.user = null;
    res.render('ejs/home', {
        layout: 'partial/home/layout.ejs',
        title: '首頁',
        totalServers: total?.Servers ?? undefined,
        totalMembers: total?.Members ?? undefined,
        totalChannels: total?.Channels ?? undefined,
        err: req.query.err ?? undefined,
        user: req.session.user ?? undefined,
    });
});

module.exports = router;