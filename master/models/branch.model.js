
const branchModel = {
    getBranchList: async (connection) => {
        let qry = `
            SELECT bm.branch_id, bm.state_id, bm.district_id, sm.state_name, dm.district_name, 
                bm.branch_code, bm.branch_name, bm.branch_status
            FROM branch_master AS bm
            LEFT JOIN state_master AS sm ON bm.state_id = sm.state_id
            LEFT JOIN district_master AS dm ON bm.district_id = dm.district_id
            WHERE bm.d_status = 0
            ORDER BY bm.branch_id DESC
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
    getBranchById: async (branch_id, connection) => {
        let qry = `
            SELECT bm.branch_id, bm.state_id, bm.district_id, sm.state_name, dm.district_name, bm.branch_code, bm.branch_name, bm.branch_status
            FROM branch_master AS bm
            LEFT JOIN state_master AS sm ON bm.state_id = sm.state_id
            LEFT JOIN district_master AS dm ON bm.district_id = dm.district_id
            WHERE bm.branch_id = ?
            AND bm.d_status = 0
        `;
        let val = [branch_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    checkBranchExists: async (data, connection) => {

        let qry;
        let val;
        if(data.branch_id > 0) {
            qry = `
                SELECT branch_id 
                FROM branch_master
                WHERE state_id = ? 
                AND district_id = ? 
                AND branch_code = ?
                AND d_status = 0
                AND branch_id != ?
            `;
            val = [data.state_id, data.district_id, data.branch_code, data.branch_id];
        } else {
            qry = `
                SELECT branch_id 
                FROM branch_master
                WHERE state_id = ? 
                AND district_id = ? 
                AND branch_code = ?
                AND d_status = 0
            `;
            val = [data.state_id, data.district_id, data.branch_code];
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
    createBranch: async (data, connection) => {
        let qry = `
            INSERT INTO branch_master SET
                state_id = ?,
                district_id = ?,
                branch_code = ?,
                branch_name = ?,
                branch_status = 1,
                created_at = NOW(),
                created_by = ?
        `;
        let val = [data.state_id, data.district_id, data.branch_code, data.branch_name, data.emp_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },    
    updateBranch: async (data, connection) => {
        let qry = `
            UPDATE branch_master SET
                state_id = ?,
                district_id = ?,
                branch_code = ?,
                branch_name = ?,
                branch_status = ?,
                updated_at = NOW(),
                updated_by = ?
            WHERE branch_id = ?
        `;
        let val = [data.state_id, data.district_id, data.branch_code, data.branch_name, data.branch_status, data.emp_id, data.branch_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    deleteBranch: async (data, connection) => {
        let qry = `
            UPDATE branch_master SET
                d_status = 1,
                deleted_at = NOW(),
                deleted_by = ?
            WHERE branch_id = ?
        `;
        let val = [data.emp_id, data.branch_id];
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

module.exports = branchModel;