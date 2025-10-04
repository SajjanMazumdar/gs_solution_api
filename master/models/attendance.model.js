
const attendanceModel = {
    getAttendanceList: async (connection) => {
        let qry = `
            SELECT SELECT att.attendance_id, att.line_id, lm.line_name, att.year_id, ym.year_val, ym.leap_year, att.month_id, mm.month_val, mm.month_days, attendance_status
            FROM t_t_attendance AS att
            LEFT JOIN line_master AS lm ON att.line_id = lm.line_id 
            LEFT JOIN year_master AS ym ON att.year_id = ym.year_id
            LEFT JOIN month_master AS mm ON att.month_id = mm.month_id
            WHERE att.d_status = 0
            ORDER BY att.attendance_id DESC
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
    getAttendanceById: async (attendance_id, connection) => {
        let qry = `
            SELECT gm.attendance_id, gm.attendance_code, 
            gm.branch_id, bm.branch_code, bm.branch_name,
            gm.line_id, lm.line_code, lm.line_name,
            gm.rank_id, rm.rank_code, rm.rank_name,
            gm.attendance_name, gm.father_name, gm.birth_place, gm.birth_date, gm.join_date, gm.attendance_height, gm.maritial_status, gm.contact_number, gm.qualification, gm.identification, gm.experience, 
            gm.state_id, gm.district_id, sm.state_name, dm.district_name, gm.current_address, gm.permanent_address, 
            gm.attendance_status
            FROM attendance_master AS gm
            LEFT JOIN branch_master AS bm ON gm.branch_id = bm.branch_id
            LEFT JOIN line_master AS lm ON gm.line_id = lm.line_id
            LEFT JOIN rank_master AS rm ON gm.rank_id = rm.rank_id
            LEFT JOIN state_master AS sm ON gm.state_id = sm.state_id
            LEFT JOIN district_master AS dm ON gm.district_id = dm.district_id
            WHERE gm.attendance_id = ?
            AND gm.d_status = 0
        `;
        let val = [attendance_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    checkAttendanceExists: async (data, connection) => {

        let qry;
        let val;
        if(data.attendance_id > 0) {
            qry = `
                SELECT attendance_id 
                FROM attendance_master
                WHERE attendance_code = ?
                AND d_status = 0
                AND attendance_id != ?
            `;
            val = [data.attendance_code, data.attendance_id];
        } else {
            qry = `
                SELECT attendance_id 
                FROM attendance_master
                WHERE attendance_code = ?
                AND d_status = 0
            `;
            val = [data.attendance_code];
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
    createAttendance: async (data, connection) => {
        let qry = `
            INSERT INTO attendance_master SET
                attendance_code = ?,
                branch_id = ?,
                line_id = ?,
                rank_id = ?,
                attendance_name = ?,
                father_name = ?,
                birth_place = ?,
                birth_date = STR_TO_DATE(?,'%d-%m-%Y'),
                join_date = STR_TO_DATE(?,'%d-%m-%Y'),
                attendance_height = ?,
                maritial_status = ?,
                contact_number = ?,
                qualification = ?,
                identification = ?,
                experience = ?,
                state_id = ?,
                district_id = ?,
                current_address = ?,
                permanent_address = ?,
                attendance_status = 1,
                created_at = NOW(),
                created_by = ?
        `;
        let val = [
            data.attendance_code,
            data.branch_id,
            data.line_id,
            data.rank_id,
            data.attendance_name,
            data.father_name,
            data.birth_place,
            data.birth_date,
            data.join_date,
            data.attendance_height,
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
    updateAttendance: async (data, connection) => {
        let qry = `
            UPDATE attendance_master SET
                attendance_code = ?,
                branch_id = ?,
                line_id = ?,
                rank_id = ?,
                attendance_name = ?,
                father_name = ?,
                birth_place = ?,
                birth_date = STR_TO_DATE(?,'%d-%m-%Y'),
                join_date = STR_TO_DATE(?,'%d-%m-%Y'),
                attendance_height = ?,
                maritial_status = ?,
                contact_number = ?,
                qualification = ?,
                identification = ?,
                experience = ?,
                state_id = ?,
                district_id = ?,
                current_address = ?,
                permanent_address = ?,
                attendance_status = ?,
                updated_at = NOW(),
                updated_by = ?
            WHERE attendance_id = ?
        `;
        let val = [
            data.attendance_code,
            data.branch_id,
            data.line_id,
            data.rank_id,
            data.attendance_name,
            data.father_name,
            data.birth_place,
            data.birth_date,
            data.join_date,
            data.attendance_height,
            data.maritial_status,
            data.contact_number,
            data.qualification,
            data.identification,
            data.experience,
            data.state_id,
            data.district_id,
            data.current_address,
            data.permanent_address, 
            data.attendance_status, 
            data.emp_id, 
            data.attendance_id
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
    deleteAttendance: async (data, connection) => {
        let qry = `
            UPDATE attendance_master SET
                d_status = 1,
                deleted_at = NOW(),
                deleted_by = ?
            WHERE attendance_id = ?
        `;
        let val = [data.emp_id, data.attendance_id];
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

module.exports = attendanceModel;