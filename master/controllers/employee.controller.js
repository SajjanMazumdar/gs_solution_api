const pool = require('../configs/mysql2.config');
const logger = require('../logs/logger');
const employeeModel = require('../models/employee.model');
const emptyArray = new Array();

let employeeController = {
    getEmployeeList: async (cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let res1 = await employeeModel.getLineList(connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await employeeModel.getBranchList(connection);
            if (res2.error) throw new Error(res2.error);

            let res3 = await employeeModel.getEmployeeList(connection);
            if (res3.error) throw new Error(res3.error);

            for (let i = 0; i < res3.result.length; i++) { 
                let lineIds = res3.result[i].line_ids ? res3.result[i].line_ids.split(',') : [];
                let lineNames = [];
                for (let j = 0; j < lineIds.length; j++) {
                    let lineId = parseInt(lineIds[j]);
                    let line = res1.result.find(line => line.line_id === lineId);
                    if (line) {
                        lineNames.push(line.line_name);
                    }
                }
                res3.result[i].line_names = lineNames.join(', ');
            }

            for (let i = 0; i < res3.result.length; i++) { 
                let branchIds = res3.result[i].branch_ids ? res3.result[i].branch_ids.split(',') : [];
                let branchNames = [];
                for (let j = 0; j < branchIds.length; j++) {
                    let branchId = parseInt(branchIds[j]);
                    let branch = res2.result.find(branch => branch.branch_id === branchId);
                    if (branch) {
                        branchNames.push(branch.branch_name);
                    }
                }
                res3.result[i].branch_names = branchNames.join(', ');
            }



            await connection.commit();
            return cb(null, res3.result);

        } catch (error) {
            logger.error("Error in getEmployeeList: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    createEmployee: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkEmployee = await employeeModel.checkEmpExists(reqBody, connection);
            if (checkEmployee.error) throw new Error(checkEmployee.error);

            if(checkEmployee.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Employee already exists with the same branch and Employee code." 
                    }
                );
            }

            let res1 = await employeeModel.createEmployee(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await employeeModel.getEmployeeById(res1.result.insertId, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in createEmployee: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    updateEmployee: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkEmployee = await employeeModel.checkEmpExists(reqBody, connection);
            if (checkEmployee.error) throw new Error(checkEmployee.error);

            if(checkEmployee.result) {
                await connection.rollback();
                return cb(
                    true, 
                    { 
                        message: "Employee already exists with the same branch and Employee code." 
                    }
                );
            }


            let res1 = await employeeModel.updateEmployee(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            let res2 = await employeeModel.getEmployeeById(reqBody.emp_id, connection);
            if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, res2.result);

        } catch (error) {
            logger.error("Error in updateEmployee: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
    deleteEmployee: async (reqBody, cb) => {
        let connection;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let res1 = await employeeModel.deleteEmployee(reqBody, connection);
            if (res1.error) throw new Error(res1.error);

            // let res2 = await branchModel.getBranchById(reqBody.branch_id, connection);
            // if (res2.error) throw new Error(res2.error);

            await connection.commit();
            return cb(null, true);

        } catch (error) {
            logger.error("Error in deleteEmployee: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    },
};

module.exports = employeeController;