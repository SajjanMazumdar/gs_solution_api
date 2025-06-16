const pool = require('../configs/mysql2.config');
const logger = require('../logs/logger');
const villageModel = require('../models/village.model');
const emptyArray = new Array();

let villageController = {
    getVillageList: async (cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let res = await villageModel.getVillageList(connection);
            if (res.error) throw new Error(res.error);

            await connection.commit();
            return cb(null, res.result);

        } catch (error) {
            logger.error("Error in getVillageList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    createVillage: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkVillage = await villageModel.checkVillageExists(reqBody, connection);
            if (checkVillage.error) throw new Error(checkVillage.error);

            if(checkVillage.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Village already exists with the same line and village code." 
                    }
                );
            }

            let res1 = await villageModel.createVillage(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await villageModel.getVillageById(res1.result.insertId, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in createVillage: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    updateVillage: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkVillage = await villageModel.checkVillageExists(reqBody, connection);
            if (checkVillage.error) throw new Error(checkVillage.error);

            if(checkVillage.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Village already exists with the same line and village code." 
                    }
                );
            }

            let res1 = await villageModel.updateVillage(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await villageModel.getVillageById(reqBody.village_id, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in updateVillage: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    deleteVillage: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let res1 = await villageModel.deleteVillage(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            // let res2 = await branchModel.getBranchById(reqBody.branch_id, connection);
            // if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, true);

        } catch (error) {
            logger.error("Error in deleteVillage: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
};

module.exports = villageController;