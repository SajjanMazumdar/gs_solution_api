const pool = require('../configs/mysql2.config');
const logger = require('../logs/logger');
const guardModel = require('../models/guard.model');
const emptyArray = new Array();

let guardController = {
    getGuardList: async (cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let res = await guardModel.getGuardList(connection);
            if (res.error) throw new Error(res.error);

            await connection.commit();
            return cb(null, res.result);

        } catch (error) {
            logger.error("Error in getGuardList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    createGuard: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkGuard = await guardModel.checkGuardExists(reqBody, connection);
            if (checkGuard.error) throw new Error(checkGuard.error);

            if(checkGuard.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Guard already exists with the same guard code." 
                    }
                );
            }

            let res1 = await guardModel.createGuard(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await guardModel.getGuardById(res1.result.insertId, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in createGuard: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    updateGuard: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkGuard = await guardModel.checkGuardExists(reqBody, connection);
            if (checkGuard.error) throw new Error(checkGuard.error);

            if(checkGuard.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Guard already exists with the same guard code." 
                    }
                );
            }

            let res1 = await guardModel.updateGuard(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await guardModel.getGuardById(reqBody.guard_id, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in updateGuard: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    deleteGuard: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let res1 = await guardModel.deleteGuard(reqBody, connection);
            if (res1.error) throw new Error(res1.error);
            
            await connection.commit();
            return cb(null, true);

        } catch (error) {
            logger.error("Error in deleteGuard: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
};

module.exports = guardController;