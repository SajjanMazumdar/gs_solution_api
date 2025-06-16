
const villageModel = {
    getVillageList: async (connection) => {
        let qry = `
            SELECT vm.village_id, vm.line_id, vm.village_code, vm.village_name, lm.branch_id, lm.line_code, lm.line_name, bm.branch_code, bm.branch_name,
                bm.state_id, bm.district_id, sm.state_name, dm.district_name, vm.village_status
            FROM village_master AS vm
            LEFT JOIN line_master AS lm ON vm.line_id = lm.line_id
            LEFT JOIN branch_master AS bm ON lm.branch_id = bm.branch_id
            LEFT JOIN state_master AS sm ON bm.state_id = sm.state_id
            LEFT JOIN district_master AS dm ON bm.district_id = dm.district_id
            WHERE vm.d_status = 0
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
    getVillageById: async (village_id, connection) => {
        let qry = `
            SELECT vm.village_id, vm.line_id, vm.village_code, vm.village_name, lm.branch_id, lm.line_code, lm.line_name, bm.branch_code, bm.branch_name,
                bm.state_id, bm.district_id, sm.state_name, dm.district_name, vm.village_status
            FROM village_master AS vm
            LEFT JOIN line_master AS lm ON vm.line_id = lm.line_id
            LEFT JOIN branch_master AS bm ON lm.branch_id = bm.branch_id
            LEFT JOIN state_master AS sm ON bm.state_id = sm.state_id
            LEFT JOIN district_master AS dm ON bm.district_id = dm.district_id
            WHERE vm.village_id = ?
            AND vm.d_status = 0
        `;
        let val = [village_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    checkVillageExists: async (data, connection) => {

        let qry;
        let val;
        if (data.line_id > 0) {
            qry = `
                SELECT village_id 
                FROM village_master
                WHERE line_id = ? 
                AND village_code = ?
                AND d_status = 0
                AND village_id != ?
            `;
            val = [data.line_id, data.village_code, data.village_id];
        } else {
            qry = `
                SELECT village_id 
                FROM village_master
                WHERE line_id = ? 
                AND village_code = ?
                AND d_status = 0
            `;
            val = [data.line_id, data.village_code];
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
    createVillage: async (data, connection) => {
        let qry = `
            INSERT INTO village_master SET
                line_id = ?,
                village_code = ?,
                village_name = ?,
                village_status = 1
        `;
        let val = [data.line_id, data.village_code, data.village_name];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },    
    updateVillage: async (data, connection) => {
        let qry = `
            UPDATE village_master SET
                line_id = ?,
                village_code = ?,
                village_name = ?,
                village_status = ?
            WHERE village_id = ?
        `;
        let val = [data.line_id, data.village_code, data.village_name, data.village_status, data.village_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    deleteVillage: async (data, connection) => {
        let qry = `
            UPDATE village_master SET
                d_status = 1
            WHERE village_id = ?
        `;
        let val = [data.village_id];
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

module.exports = villageModel;