const pool = require('../configs/mysql2.config');
const logger = require('../logs/logger');
const bankModel = require('../models/bank.model');
const emptyArray = new Array();

let bankController = {
    getBankList: async (cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let res = await bankModel.getBankList(connection);
            if (res.error) throw new Error(res.error);

            await connection.commit();
            return cb(null, res.result);

        } catch (error) {
            logger.error("Error in getBankList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    createBank: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkBank = await bankModel.checkBankExists(reqBody, connection);
            if (checkBank.error) throw new Error(checkBank.error);

            if(checkBank.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Bank already exists with the same bank code." 
                    }
                );
            }

            let res1 = await bankModel.createBank(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await bankModel.getBankById(res1.result.insertId, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in createBank: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    updateBank: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkBank = await bankModel.checkBankExists(reqBody, connection);
            if (checkBank.error) throw new Error(checkBank.error);

            if(checkBank.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Bank already exists with the same bank code." 
                    }
                );
            }

            let res1 = await bankModel.updateBank(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await bankModel.getBankById(reqBody.bank_id, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in updateBank: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    deleteBank: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            // let checkBank = await bankModel.checkBankExists(reqBody, connection);
            // if (checkBank.error) throw new Error(checkBank.error);

            // if(!checkBank.result) {
            //     await connection.rollback();
            //     return cb(
            //         true, 
            //         { 
            //             message: "Bank already exists with the same state, district and bank code." 
            //         }
            //     );
            // }

            let res1 = await bankModel.deleteBank(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            // let res2 = await bankModel.getBankById(reqBody.bank_id, connection);
            // if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, true);

        } catch (error) {
            logger.error("Error in deleteBank: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
};

module.exports = bankController;