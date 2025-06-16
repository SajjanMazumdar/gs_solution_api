const pool = require('../configs/mysql2.config');
const logger = require('../logs/logger');
const areaModel = require('../models/area.model');

const emptyArray = new Array();

let areaController = {
    getStateList: async (cb) => {
        let connection;
        try {
            
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();
            
            let res = await areaModel.getStateList(connection);
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
            
            let res = await areaModel.getDistrictList(connection);
            if (res.error) throw new Error(res.error);

            await connection.commit();
            return cb(null, res.result);
            

        } catch (error) {
            logger.error("Error in getDistrictList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }

    },
}

module.exports = areaController;