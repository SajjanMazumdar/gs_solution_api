const express = require('express');
const branchRouter = express.Router();
const branchController = require('../controllers/branch.controller');

branchRouter.get('/list', function(req, res, next) {
  try {
    branchController.getBranchList(function(err, result) {
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

branchRouter.post('/create', function(req, res, next) {
  try {
    reqBody = req.body;
    branchController.createBranch(reqBody, function(err, result) {
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


branchRouter.put('/update', function(req, res, next) {
  try {
    reqBody = req.body;
    branchController.updateBranch(reqBody, function(err, result) {
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


branchRouter.put('/delete', function(req, res, next) {
  try {
    reqBody = req.body;
    branchController.deleteBranch(reqBody, function(err, result) {
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

module.exports = branchRouter;