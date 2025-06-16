const pool = require('../configs/mysql2.config');
const logger = require('../logs/logger');
const farmerModel = require('../models/farmer.model');
const emptyArray = new Array();

let farmerController = {
    getFarmerList: async (cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let res = await farmerModel.getFarmerList(connection);
            if (res.error) throw new Error(res.error);

            await connection.commit();
            return cb(null, res.result);

        } catch (error) {
            logger.error("Error in getFarmerList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    createFarmer: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkFarmer = await farmerModel.checkFarmerExists(reqBody, connection);
            if (checkFarmer.error) throw new Error(checkFarmer.error);

            if(checkFarmer.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Farmer already exists with the same state, district and farmer code." 
                    }
                );
            }

            let res1 = await farmerModel.createFarmer(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await farmerModel.getFarmerById(res1.result.insertId, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in createFarmer: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    updateFarmer: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkFarmer = await farmerModel.checkFarmerExists(reqBody, connection);
            if (checkFarmer.error) throw new Error(checkFarmer.error);

            if(checkFarmer.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Farmer already exists with the same state, district and farmer code." 
                    }
                );
            }

            let res1 = await farmerModel.updateFarmer(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await farmerModel.getFarmerById(reqBody.farmer_id, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in updateFarmer: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    deleteFarmer: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            // let checkFarmer = await farmerModel.checkFarmerExists(reqBody, connection);
            // if (checkFarmer.error) throw new Error(checkFarmer.error);

            // if(!checkFarmer.result) {
            //     await connection.rollback();
            //     return cb(
            //         true, 
            //         { 
            //             message: "Farmer already exists with the same state, district and farmer code." 
            //         }
            //     );
            // }

            let res1 = await farmerModel.deleteFarmer(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            // let res2 = await farmerModel.getFarmerById(reqBody.farmer_id, connection);
            // if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, true);

        } catch (error) {
            logger.error("Error in deleteFarmer: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },    
    approvalFarmer: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            // let checkFarmer = await farmerModel.checkFarmerExists(reqBody, connection);
            // if (checkFarmer.error) throw new Error(checkFarmer.error);

            // if(!checkFarmer.result) {
            //     await connection.rollback();
            //     return cb(
            //         true, 
            //         { 
            //             message: "Farmer already exists with the same state, district and farmer code." 
            //         }
            //     );
            // }

            let res1 = await farmerModel.approvalFarmer(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await farmerModel.getFarmerById(reqBody.farmer_id, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in deleteFarmer: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
};

module.exports = farmerController;