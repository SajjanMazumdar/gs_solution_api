const express = require('express');
const employeeRouter = express.Router();
const employeeController = require('../controllers/employee.controller');

employeeRouter.get('/list', function(req, res, next) {
  try {
    employeeController.getEmployeeList(function(err, result) {
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

employeeRouter.post('/create', function(req, res, next) {
  try {
    reqBody = req.body;
    employeeController.createEmployee(reqBody, function(err, result) {
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


employeeRouter.put('/update', function(req, res, next) {
  try {
    reqBody = req.body;
    employeeController.updateEmployee(reqBody, function(err, result) {
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

employeeRouter.put('/delete', function(req, res, next) {
  try {
    reqBody = req.body;
    employeeController.deleteEmployee(reqBody, function(err, result) {
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

module.exports = employeeRouter;