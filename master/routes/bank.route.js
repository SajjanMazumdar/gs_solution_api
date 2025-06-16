const express = require('express');
const bankRouter = express.Router();
const bankController = require('../controllers/bank.controller');

bankRouter.get('/list', function(req, res, next) {
  try {
    bankController.getBankList(function(err, result) {
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

bankRouter.post('/create', function(req, res, next) {
  try {
    reqBody = req.body;
    bankController.createBank(reqBody, function(err, result) {
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


bankRouter.put('/update', function(req, res, next) {
  try {
    reqBody = req.body;
    bankController.updateBank(reqBody, function(err, result) {
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


bankRouter.put('/delete', function(req, res, next) {
  try {
    reqBody = req.body;
    bankController.deleteBank(reqBody, function(err, result) {
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

module.exports = bankRouter;