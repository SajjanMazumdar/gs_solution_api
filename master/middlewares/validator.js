const { validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: true,
        result: [],
        details: errors.array().map(e => e.msg)
      });
    }
    next();
  };
};

module.exports = validate;
