const pool = require('../configs/mysql2.config');
const logger = require('../logs/logger');
const rankModel = require('../models/rank.model');
const emptyArray = new Array();

let rankController = {
    getRankList: async (cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let res = await rankModel.getRankList(connection);
            if (res.error) throw new Error(res.error);

            await connection.commit();
            return cb(null, res.result);

        } catch (error) {
            logger.error("Error in getRankList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    createRank: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkRank = await rankModel.checkRankExists(reqBody, connection);
            if (checkRank.error) throw new Error(checkRank.error);

            if(checkRank.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Rank already exists with the same rank code." 
                    }
                );
            }

            let res1 = await rankModel.createRank(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await rankModel.getRankById(res1.result.insertId, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in createRank: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    updateRank: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkRank = await rankModel.checkRankExists(reqBody, connection);
            if (checkRank.error) throw new Error(checkRank.error);

            if(checkRank.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Rank already exists with the same rank code." 
                    }
                );
            }

            let res1 = await rankModel.updateRank(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await rankModel.getRankById(reqBody.rank_id, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in updateRank: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    deleteRank: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            // let checkRank = await rankModel.checkRankExists(reqBody, connection);
            // if (checkRank.error) throw new Error(checkRank.error);

            // if(!checkRank.result) {
            //     await connection.rollback();
            //     return cb(
            //         true, 
            //         { 
            //             message: "Rank already exists with the same state, district and rank code." 
            //         }
            //     );
            // }

            let res1 = await rankModel.deleteRank(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            // let res2 = await rankModel.getRankById(reqBody.rank_id, connection);
            // if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, true);

        } catch (error) {
            logger.error("Error in deleteRank: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
};

module.exports = rankController;