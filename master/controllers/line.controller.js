const pool = require('../configs/mysql2.config');
const logger = require('../logs/logger');
const lineModel = require('../models/line.model');
const emptyArray = new Array();

let lineController = {
    getLineList: async (cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let res = await lineModel.getLineList(connection);
            if (res.error) throw new Error(res.error);

            await connection.commit();
            return cb(null, res.result);

        } catch (error) {
            logger.error("Error in getLineList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    createLine: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkLine = await lineModel.checkLineExists(reqBody, connection);
            if (checkLine.error) throw new Error(checkLine.error);

            if(checkLine.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Line already exists with the same branch and line code." 
                    }
                );
            }

            let res1 = await lineModel.createLine(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await lineModel.getLineById(res1.result.insertId, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in createLine: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    updateLine: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkLine = await lineModel.checkLineExists(reqBody, connection);
            if (checkLine.error) throw new Error(checkLine.error);

            if(checkLine.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Line already exists with the same branch and line code." 
                    }
                );
            }

            let res1 = await lineModel.updateLine(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await lineModel.getLineById(reqBody.line_id, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in updateLine: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    deleteLine: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let res1 = await lineModel.deleteLine(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            // let res2 = await branchModel.getBranchById(reqBody.branch_id, connection);
            // if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, true);

        } catch (error) {
            logger.error("Error in deleteLine: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
};

module.exports = lineController;