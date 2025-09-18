
const guardModel = {
    getGuardList: async (connection) => {
        let qry = `
            SELECT gm.guard_id, gm.guard_code, 
            gm.branch_id, bm.branch_code, bm.branch_name,
            gm.line_id, lm.line_code, lm.line_name,
            gm.rank_id, rm.rank_code, rm.rank_name,
            gm.guard_name, gm.father_name, gm.birth_place, gm.birth_date, gm.join_date, gm.guard_height, gm.maritial_status, gm.contact_number, gm.qualification, gm.identification, gm.experience, 
            gm.state_id, gm.district_id, sm.state_name, dm.district_name, gm.current_address, gm.permanent_address, 
            gm.guard_status
            FROM guard_master AS gm
            LEFT JOIN branch_master AS bm ON gm.branch_id = bm.branch_id
            LEFT JOIN line_master AS lm ON gm.line_id = lm.line_id
            LEFT JOIN rank_master AS rm ON gm.rank_id = rm.rank_id
            LEFT JOIN state_master AS sm ON gm.state_id = sm.state_id
            LEFT JOIN district_master AS dm ON gm.district_id = dm.district_id
            WHERE gm.d_status = 0
            ORDER BY gm.guard_id DESC
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
    getGuardById: async (guard_id, connection) => {
        let qry = `
            SELECT gm.guard_id, gm.guard_code, 
            gm.branch_id, bm.branch_code, bm.branch_name,
            gm.line_id, lm.line_code, lm.line_name,
            gm.rank_id, rm.rank_code, rm.rank_name,
            gm.guard_name, gm.father_name, gm.birth_place, gm.birth_date, gm.join_date, gm.guard_height, gm.maritial_status, gm.contact_number, gm.qualification, gm.identification, gm.experience, 
            gm.state_id, gm.district_id, sm.state_name, dm.district_name, gm.current_address, gm.permanent_address, 
            gm.guard_status
            FROM guard_master AS gm
            LEFT JOIN branch_master AS bm ON gm.branch_id = bm.branch_id
            LEFT JOIN line_master AS lm ON gm.line_id = lm.line_id
            LEFT JOIN rank_master AS rm ON gm.rank_id = rm.rank_id
            LEFT JOIN state_master AS sm ON gm.state_id = sm.state_id
            LEFT JOIN district_master AS dm ON gm.district_id = dm.district_id
            WHERE gm.guard_id = ?
            AND gm.d_status = 0
        `;
        let val = [guard_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    checkGuardExists: async (data, connection) => {

        let qry;
        let val;
        if(data.guard_id > 0) {
            qry = `
                SELECT guard_id 
                FROM guard_master
                WHERE guard_code = ?
                AND d_status = 0
                AND guard_id != ?
            `;
            val = [data.guard_code, data.guard_id];
        } else {
            qry = `
                SELECT guard_id 
                FROM guard_master
                WHERE guard_code = ?
                AND d_status = 0
            `;
            val = [data.guard_code];
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
    createGuard: async (data, connection) => {
        let qry = `
            INSERT INTO guard_master SET
                guard_code = ?,
                branch_id = ?,
                line_id = ?,
                rank_id = ?,
                guard_name = ?,
                father_name = ?,
                birth_place = ?,
                birth_date = STR_TO_DATE(?,'%d-%m-%Y'),
                join_date = STR_TO_DATE(?,'%d-%m-%Y'),
                guard_height = ?,
                maritial_status = ?,
                contact_number = ?,
                qualification = ?,
                identification = ?,
                experience = ?,
                state_id = ?,
                district_id = ?,
                current_address = ?,
                permanent_address = ?,
                guard_status = 1,
                created_at = NOW(),
                created_by = ?
        `;
        let val = [
            data.guard_code,
            data.branch_id,
            data.line_id,
            data.rank_id,
            data.guard_name,
            data.father_name,
            data.birth_place,
            data.birth_date,
            data.join_date,
            data.guard_height,
            data.maritial_status,
            data.contact_number,
            data.qualification,
            data.identification,
            data.experience,
            data.state_id,
            data.district_id,
            data.current_address,
            data.permanent_address, 
            data.emp_id
        ];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },    
    updateGuard: async (data, connection) => {
        let qry = `
            UPDATE guard_master SET
                guard_code = ?,
                branch_id = ?,
                line_id = ?,
                rank_id = ?,
                guard_name = ?,
                father_name = ?,
                birth_place = ?,
                birth_date = STR_TO_DATE(?,'%d-%m-%Y'),
                join_date = STR_TO_DATE(?,'%d-%m-%Y'),
                guard_height = ?,
                maritial_status = ?,
                contact_number = ?,
                qualification = ?,
                identification = ?,
                experience = ?,
                state_id = ?,
                district_id = ?,
                current_address = ?,
                permanent_address = ?,
                guard_status = ?,
                updated_at = NOW(),
                updated_by = ?
            WHERE guard_id = ?
        `;
        let val = [
            data.guard_code,
            data.branch_id,
            data.line_id,
            data.rank_id,
            data.guard_name,
            data.father_name,
            data.birth_place,
            data.birth_date,
            data.join_date,
            data.guard_height,
            data.maritial_status,
            data.contact_number,
            data.qualification,
            data.identification,
            data.experience,
            data.state_id,
            data.district_id,
            data.current_address,
            data.permanent_address, 
            data.guard_status, 
            data.emp_id, 
            data.guard_id
        ];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },       
    deleteGuard: async (data, connection) => {
        let qry = `
            UPDATE guard_master SET
                d_status = 1,
                deleted_at = NOW(),
                deleted_by = ?
            WHERE guard_id = ?
        `;
        let val = [data.emp_id, data.guard_id];
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

module.exports = guardModel;