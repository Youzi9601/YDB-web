const express = require('express');
const router = express.Router();
const statistics_db = require('../../Helpers/database')('Client/status', { table: 'statistics' });

// home
router.get('/', async (req, res) => {
    // console.log(req.session);
    console.log(req.session.user);
    if (req.session.user?.message && req.session.user.message == '401: Unauthorized')
        req.session.user = null;
    res.render('ejs/home', {
        layout: 'partial/home/layout.ejs',
        title: '首頁',
        totalServers: await statistics_db.get('total.Servers'),
        totalMembers: await statistics_db.get('total.Members'),
        totalChannels: await statistics_db.get('total.Channels'),
        err: req.query.err ?? undefined,
        user: req.session.user ?? undefined,
    });
});

module.exports = router;