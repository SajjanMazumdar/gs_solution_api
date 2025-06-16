
const employeeModel = {
    getBranchList: async (connection) => {
        let qry = `
            SELECT bm.branch_id, bm.branch_code, bm.branch_name, bm.branch_status,
                bm.state_id, bm.district_id, sm.state_name, dm.district_name
            FROM branch_master AS bm
            LEFT JOIN state_master AS sm ON bm.state_id = sm.state_id
            LEFT JOIN district_master AS dm ON bm.district_id = dm.district_id
            WHERE bm.d_status = 0
        `;
        let val = '';
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    getLineList: async (connection) => {
        let qry = `
            SELECT lm.line_id, lm.branch_id, lm.line_code, lm.line_name, lm.line_status
            FROM line_master AS lm
            WHERE lm.d_status = 0
        `;
        let val = '';
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    getEmployeeList: async (connection) => {
        let qry = `
            SELECT em.emp_id, em.emp_code, em.emp_name, em.line_ids, em.branch_ids, em.emp_status
            FROM emp_master AS em
            WHERE em.d_status = 0
        `;
        let val = '';
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    getEmployeeById: async (emp_id, connection) => {
        let qry = `
            SELECT em.emp_id, em.emp_code, em.emp_name, em.line_ids, em.branch_ids, em.emp_status
            FROM emp_master AS em
            WHERE em.emp_id = ?
            AND em.d_status = 0
        `;
        let val = [emp_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    checkEmpExists: async (data, connection) => {

        let qry;
        let val;
        if (data.emp_id > 0) {
            qry = `
                SELECT emp_id 
                FROM emp_master
                WHERE emp_code = ?
                AND d_status = 0
                AND emp_id != ?
            `;
            val = [data.emp_code, data.emp_id];
        } else {
            qry = `
                SELECT emp_id 
                FROM emp_master
                WHERE emp_code = ?
                AND d_status = 0
            `;
            val = [data.emp_code];
        }

        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                if (result.length > 0) {
                    return { error: null, result: result[0] };
                } else {
                    return { error: null, result: null };
                }
            })
            .catch((err) => {
                return { error: err };
            });
    },
    createEmployee: async (data, connection) => {
        let qry = `
            INSERT INTO emp_master SET
                branch_ids = ?,
                line_ids = ?,
                emp_code = ?,
                emp_name = ?,
                emp_status = 1
        `;
        let val = [data.branch_ids, data.line_ids, data.emp_code, data.emp_name];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    updateEmployee: async (data, connection) => {
        let qry = `
            UPDATE emp_master SET
                branch_ids = ?,
                line_ids = ?,
                emp_code = ?,
                emp_name = ?,
                emp_status = ?
            WHERE emp_id = ?
        `;
        let val = [data.branch_ids, data.line_ids, data.emp_code, data.emp_name, data.emp_status, data.emp_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    deleteEmployee: async (data, connection) => {
        let qry = `
            UPDATE emp_master SET
                d_status = 1
            WHERE emp_id = ?
        `;
        let val = [data.emp_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
}

module.exports = employeeModel;