const express = require('express');
const rankRouter = express.Router();
const rankController = require('../controllers/rank.controller');
const { query, body, param } = require('express-validator');
const validate = require('../middlewares/validator');
const { matchedData } = require('express-validator');
const auth = require('../middlewares/auth.middleware');

rankRouter.get('/list', auth, function(req, res, next) {
  try {
    // const emp_id = req.emp_id;
    rankController.getRankList(function(err, result) {
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

rankRouter.post('/create', auth, function(req, res, next) {
  try {
    reqBody = req.body;
    reqBody.emp_id = req.emp_id;
    rankController.createRank(reqBody, function(err, result) {
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


rankRouter.put('/update', auth, function(req, res, next) {
  try {
    reqBody = req.body;
    reqBody.emp_id = req.emp_id;
    rankController.updateRank(reqBody, function(err, result) {
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


rankRouter.put('/delete', auth, function(req, res, next) {
  try {
    reqBody = req.body;
    reqBody.emp_id = req.emp_id;
    rankController.deleteRank(reqBody, function(err, result) {
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

module.exports = rankRouter;