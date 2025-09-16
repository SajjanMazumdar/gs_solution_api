const areaModel = {
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
            SELECT dm.district_id, dm.district_name, dm.state_id, sm.state_name
            FROM district_master AS dm
            LEFT JOIN state_master As sm ON dm.state_id = sm.state_id
            WHERE dm.district_status = 1
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
}

module.exports = areaModel;