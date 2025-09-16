
const bankModel = {
    getBankList: async (connection) => {
        let qry = `
            SELECT bm.bank_id, bm.bank_code, bm.bank_name, bm.bank_status
            FROM bank_master AS bm
            WHERE bm.d_status = 0
            ORDER BY bm.bank_id DESC
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
    getBankById: async (bank_id, connection) => {
        let qry = `
            SELECT bm.bank_id, bm.bank_code, bm.bank_name, bm.bank_status
            FROM bank_master AS bm
            WHERE bm.bank_id = ?
            AND bm.d_status = 0
        `;
        let val = [bank_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    checkBankExists: async (data, connection) => {

        let qry;
        let val;
        if(data.bank_id > 0) {
            qry = `
                SELECT bank_id 
                FROM bank_master
                WHERE bank_code = ?
                AND d_status = 0
                AND bank_id != ?
            `;
            val = [data.bank_code, data.bank_id];
        } else {
            qry = `
                SELECT bank_id 
                FROM bank_master
                WHERE bank_code = ?
                AND d_status = 0
            `;
            val = [data.bank_code];
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
    createBank: async (data, connection) => {
        let qry = `
            INSERT INTO bank_master SET
                bank_code = ?,
                bank_name = ?,
                bank_status = 1,
                created_at = NOW(),
                created_by = ?
        `;
        let val = [data.bank_code, data.bank_name, data.emp_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },    
    updateBank: async (data, connection) => {
        let qry = `
            UPDATE bank_master SET
                bank_code = ?,
                bank_name = ?,
                bank_status = ?,
                updated_at = NOW(),
                updated_by = ?
            WHERE bank_id = ?
        `;
        let val = [data.bank_code, data.bank_name, data.bank_status, data.emp_id, data.bank_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },       
    deleteBank: async (data, connection) => {
        let qry = `
            UPDATE bank_master SET
                d_status = 1,
                deleted_at = NOW(),
                deleted_by = ?
            WHERE bank_id = ?
        `;
        let val = [data.emp_id, data.bank_id];
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

module.exports = bankModel;