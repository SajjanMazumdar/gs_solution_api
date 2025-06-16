const pool = require('../configs/mysql2.config');
const logger = require('../logs/logger');
const masterModel = require('../models/master.model');

const emptyArray = new Array();

let controller = {
    getStateList: async (cb) => {
        let connection;
        try {
            
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();
            
            let res = await masterModel.getStateList(connection);
            if (res.error) throw new Error(res.error);

            await connection.commit();
            return cb(null, res.result);
            

        } catch (error) {
            logger.error("Error in getStateList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }

    },
    getDistrictList: async (cb) => {
        let connection;
        try {
            
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();
            
            let res = await masterModel.getDistrictList(connection);
            if (res.error) throw new Error(res.error);

            await connection.commit();
            return cb(null, res.result);
            

        } catch (error) {
            logger.error("Error in getStateList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }

    },
    getBranchList: async (cb) => {
        let connection;
        try {
            
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();
            
            let res = await masterModel.getBranchList(connection);
            if (res.error) throw new Error(res.error);

            await connection.commit();
            return cb(null, res.result);
            

        } catch (error) {
            logger.error("Error in getStateList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }

    },
    getLineList: async (cb) => {
        let connection;
        try {
            
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();
            
            let res = await masterModel.getLineList(connection);
            if (res.error) throw new Error(res.error);

            await connection.commit();
            return cb(null, res.result);
            

        } catch (error) {
            logger.error("Error in getStateList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }

    },
    getBankList: async (cb) => {
        let connection;
        try {
            
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();
            
            let res = await masterModel.getBankList(connection);
            if (res.error) throw new Error(res.error);

            await connection.commit();
            return cb(null, res.result);
            

        } catch (error) {
            logger.error("Error in getStateList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }

    },
    getFinYrList: async (cb) => {
        let connection;
        try {
            
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();
            
            let res = await masterModel.getFinYrList(connection);
            if (res.error) throw new Error(res.error);

            await connection.commit();
            return cb(null, res.result);
            

        } catch (error) {
            logger.error("Error in getStateList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }

    },
    getEmpList: async (cb) => {
        let connection;
        try {
            
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();
            
            let res = await masterModel.getEmpList(connection);
            if (res.error) throw new Error(res.error);

            await connection.commit();
            return cb(null, res.result);
            

        } catch (error) {
            logger.error("Error in getStateList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }

    }
}

module.exports = controller;