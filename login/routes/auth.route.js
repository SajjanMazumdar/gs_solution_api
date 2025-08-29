const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');

// authRouter.post('/login', authController.login);

authRouter.post('/web', function(req, res, next) {
  try {
    reqBody = req.body;
    authController.userLogin(reqBody, function(err, result) {
        if(err) {
            if(result && result.code) {
                res.status(result.code).json({
                    error: true,
                    result: [],
                    details: result.message ? result.message : 'Something went wrong',
                });
            } else {
                res.status(400).json({
                    error: true,
                    result: [],
                    details: result.message ? result.message : 'Something went wrong',
                });
            }
        } else {
            res.status(200).json({
                error: false,
                result: result
            })
        }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = authRouter;
