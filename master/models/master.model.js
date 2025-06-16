
const masterModel = {
    getStateList: async (connection) => {
        let qry = `
            SELECT state_id, state_name 
            FROM state_master
            WHERE state_status = 1
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
    getDistrictList: async (connection) => {
        let qry = `
            SELECT district_id, state_id, district_name
            FROM district_master
            WHERE district_status = 1
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
    getBranchList: async (connection) => {
        let qry = `
            SELECT branch_id, state_id, district_id, branch_code, branch_name
            FROM branch_master
            WHERE branch_status = 1
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
            SELECT line_id, branch_id, line_code, line_name
            FROM line_master
            WHERE line_status = 1
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
    getBankList: async (connection) => {
        let qry = `
            SELECT bank_id, bank_name
            FROM bank_master
            WHERE bank_status = 1
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
    getFinYrList: async (connection) => {
        let qry = `
            SELECT fin_id, fin_value, fin_yr, fin_yr_shrt
            FROM fin_master
            WHERE fin_status = 1
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
    getEmpList: async (connection) => {
        let qry = `
            SELECT emp_id, emp_name
            FROM emp_master
            WHERE emp_status = 1
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
    }
}

module.exports = masterModel;