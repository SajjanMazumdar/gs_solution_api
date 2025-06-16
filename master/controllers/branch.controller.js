const pool = require('../configs/mysql2.config');
const logger = require('../logs/logger');
const branchModel = require('../models/branch.model');
const emptyArray = new Array();

let branchController = {
    getBranchList: async (cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let res = await branchModel.getBranchList(connection);
            if (res.error) throw new Error(res.error);

            await connection.commit();
            return cb(null, res.result);

        } catch (error) {
            logger.error("Error in getBranchList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    createBranch: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkBranch = await branchModel.checkBranchExists(reqBody, connection);
            if (checkBranch.error) throw new Error(checkBranch.error);

            if(checkBranch.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Branch already exists with the same state, district and branch code." 
                    }
                );
            }

            let res1 = await branchModel.createBranch(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await branchModel.getBranchById(res1.result.insertId, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in createBranch: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    updateBranch: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkBranch = await branchModel.checkBranchExists(reqBody, connection);
            if (checkBranch.error) throw new Error(checkBranch.error);

            if(checkBranch.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Branch already exists with the same state, district and branch code." 
                    }
                );
            }

            let res1 = await branchModel.updateBranch(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await branchModel.getBranchById(reqBody.branch_id, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in updateBranch: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    deleteBranch: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            // let checkBranch = await branchModel.checkBranchExists(reqBody, connection);
            // if (checkBranch.error) throw new Error(checkBranch.error);

            // if(!checkBranch.result) {
            //     await connection.rollback();
            //     return cb(
            //         true, 
            //         { 
            //             message: "Branch already exists with the same state, district and branch code." 
            //         }
            //     );
            // }

            let res1 = await branchModel.deleteBranch(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            // let res2 = await branchModel.getBranchById(reqBody.branch_id, connection);
            // if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, true);

        } catch (error) {
            logger.error("Error in deleteBranch: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
};

module.exports = branchController;