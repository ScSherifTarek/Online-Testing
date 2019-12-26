'use strict';

const Position = require('../../models/position.js');
const App = require('../../models/application.js');

/**
 * Show all positions available for this user
 */
exports.index = function(req, res) {
    if (req.session.loggedin && req.session.user) {
        Position.allDoesntHaveApplicationForUser(req.session.user, function (err, positions) {
            if (err) {
                res.status(500).send({
                    error: true,
                    message: err
                });
            } else {
                res.render('users/positions/index', {positions: positions, session: req.session});
            }
        });
    } else {
        res.redirect('/users');
    }
};

exports.apply = (req, res) => {
    if (req.session.loggedin && req.session.user) {
        App.create({position_id: req.params.position_id, user_id: req.session.user}, function (err, positions) {
            if (err) {
                res.status(500).send({
                    error: true,
                    message: err
                });
            } else {
                res.redirect('/users/home');
            }
        });
    } else {
        res.redirect('/users');
    }
};