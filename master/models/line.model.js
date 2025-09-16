
const lineModel = {
    getLineList: async (connection) => {
        let qry = `
            SELECT lm.line_id, lm.branch_id, lm.line_code, lm.line_name, bm.branch_code, bm.branch_name,
                bm.state_id, bm.district_id, sm.state_name, dm.district_name, lm.line_status
            FROM line_master AS lm
            LEFT JOIN branch_master AS bm ON lm.branch_id = bm.branch_id
            LEFT JOIN state_master AS sm ON bm.state_id = sm.state_id
            LEFT JOIN district_master AS dm ON bm.district_id = dm.district_id
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
    getLineById: async (line_id, connection) => {
        let qry = `
            SELECT lm.line_id, lm.branch_id, lm.line_code, lm.line_name, bm.branch_code, bm.branch_name,
                bm.state_id, bm.district_id, sm.state_name, dm.district_name, lm.line_status
            FROM line_master AS lm
            LEFT JOIN branch_master AS bm ON lm.branch_id = bm.branch_id
            LEFT JOIN state_master AS sm ON bm.state_id = sm.state_id
            LEFT JOIN district_master AS dm ON bm.district_id = dm.district_id
            WHERE lm.line_id = ?
            AND lm.d_status = 0
        `;
        let val = [line_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    checkLineExists: async (data, connection) => {

        let qry;
        let val;
        if (data.line_id > 0) {
            qry = `
                SELECT line_id 
                FROM line_master
                WHERE branch_id = ? 
                AND line_code = ?
                AND d_status = 0
                AND line_id != ?
            `;
            val = [data.branch_id, data.line_code, data.line_id];
        } else {
            qry = `
                SELECT line_id 
                FROM line_master
                WHERE branch_id = ? 
                AND line_code = ?
                AND d_status = 0
            `;
            val = [data.branch_id, data.line_code];
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
    createLine: async (data, connection) => {
        let qry = `
            INSERT INTO line_master SET
                branch_id = ?,
                line_code = ?,
                line_name = ?,
                line_status = 1
        `;
        let val = [data.branch_id, data.line_code, data.line_name];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    updateLine: async (data, connection) => {
        let qry = `
            UPDATE line_master SET
                branch_id = ?,
                line_code = ?,
                line_name = ?,
                line_status = ?
            WHERE line_id = ?
        `;
        let val = [data.branch_id, data.line_code, data.line_name, data.line_status, data.line_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    deleteLine: async (data, connection) => {
        let qry = `
            UPDATE line_master SET
                d_status = 1
            WHERE line_id = ?
        `;
        let val = [data.line_id];
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

module.exports = lineModel;