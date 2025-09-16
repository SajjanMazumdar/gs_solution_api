
const rankModel = {
    getRankList: async (connection) => {
        let qry = `
            SELECT rm.rank_id, rm.rank_code, rm.rank_name, rm.rank_status
            FROM rank_master AS rm
            WHERE rm.d_status = 0
            ORDER BY rm.rank_id DESC
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
    getRankById: async (rank_id, connection) => {
        let qry = `
            SELECT rm.rank_id, rm.rank_code, rm.rank_name, rm.rank_status
            FROM rank_master AS rm
            WHERE rm.rank_id = ?
            AND rm.d_status = 0
        `;
        let val = [rank_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    checkRankExists: async (data, connection) => {

        let qry;
        let val;
        if(data.rank_id > 0) {
            qry = `
                SELECT rank_id 
                FROM rank_master
                WHERE rank_code = ?
                AND d_status = 0
                AND rank_id != ?
            `;
            val = [data.rank_code, data.rank_id];
        } else {
            qry = `
                SELECT rank_id 
                FROM rank_master
                WHERE rank_code = ?
                AND d_status = 0
            `;
            val = [data.rank_code];
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
    createRank: async (data, connection) => {
        let qry = `
            INSERT INTO rank_master SET
                rank_code = ?,
                rank_name = ?,
                rank_status = 1,
                created_at = NOW(),
                created_by = ?
        `;
        let val = [data.rank_code, data.rank_name, data.emp_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },    
    updateRank: async (data, connection) => {
        let qry = `
            UPDATE rank_master SET
                rank_code = ?,
                rank_name = ?,
                rank_status = ?,
                updated_at = NOW(),
                updated_by = ?
            WHERE rank_id = ?
        `;
        let val = [data.rank_code, data.rank_name, data.rank_status, data.emp_id, data.rank_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },       
    deleteRank: async (data, connection) => {
        let qry = `
            UPDATE rank_master SET
                d_status = 1,
                deleted_at = NOW(),
                deleted_by = ?
            WHERE rank_id = ?
        `;
        let val = [data.emp_id, data.rank_id];
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

module.exports = rankModel;