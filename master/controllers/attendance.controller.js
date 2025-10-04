const pool = require('../configs/mysql2.config');
const logger = require('../logs/logger');
const attendanceModel = require('../models/attendance.model');
const emptyArray = new Array();

let attendanceController = {
    getAttendanceList: async (cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let res = await attendanceModel.getAttendanceList(connection);
            if (res.error) throw new Error(res.error);

            await connection.commit();
            return cb(null, res.result);

        } catch (error) {
            logger.error("Error in getAttendanceList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    createAttendance: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkAttendance = await attendanceModel.checkAttendanceExists(reqBody, connection);
            if (checkAttendance.error) throw new Error(checkAttendance.error);

            if(checkAttendance.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Attendance already exists with the same attendance code." 
                    }
                );
            }

            let res1 = await attendanceModel.createAttendance(reqBody, connection);
            if (res1.error) throw new Error(res1.error);
            const attendance_id = res1.result.insertId;
            const emp_id = reqBody.emp_id;

            let attendance_list = reqBody.attendance_list;
            for (const attendance of attendance_list) {
                let res2 = await attendanceModel.createAttendanceDetails(attendance, attendance_id, emp_id, connection);
                if (res2.error) throw new Error(res2.error);
            }

            let res3 = await attendanceModel.getAttendanceById(attendance_id, connection);
            if (res3.error) throw new Error(res3.error);

            await connection.commit();
            return cb(null, res3.result);

        } catch (error) {
            logger.error("Error in createAttendance: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    updateAttendance: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkAttendance = await attendanceModel.checkAttendanceExists(reqBody, connection);
            if (checkAttendance.error) throw new Error(checkAttendance.error);

            if(checkAttendance.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Attendance already exists with the same attendance code." 
                    }
                );
            }

            let res1 = await attendanceModel.updateAttendance(reqBody, connection);
            if (res1.error) throw new Error(res1.error);
            const attendance_id = reqBody.attendance_id;
            const emp_id = reqBody.emp_id;

            let attendance_list = reqBody.attendance_list;
            for (const attendance of attendance_list) {
                let res2 = await attendanceModel.updateAttendanceDetails(attendance, attendance_id, emp_id, connection);
                if (res2.error) throw new Error(res2.error);
            }

            let res3 = await attendanceModel.getAttendanceById(attendance_id, connection);
            if (res3.error) throw new Error(res3.error);

            await connection.commit();
            return cb(null, res3.result);

        } catch (error) {
            logger.error("Error in updateAttendance: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    deleteAttendance: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let res1 = await attendanceModel.deleteAttendance(reqBody, connection);
            if (res1.error) throw new Error(res1.error);
            
            await connection.commit();
            return cb(null, true);

        } catch (error) {
            logger.error("Error in deleteAttendance: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
};

module.exports = attendanceController;