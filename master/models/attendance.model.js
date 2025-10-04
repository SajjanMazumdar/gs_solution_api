
const attendanceModel = {
    getAttendanceList: async (connection) => {
        let qry = `
            SELECT SELECT att.attendance_id, att.line_id, lm.line_name, att.year_id, ym.year_val, ym.leap_year, att.month_id, mm.month_val, mm.month_days, att.total_duty, att.attendance_status
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
            SELECT att_d.attendance_details_id, att_d.attendance_id, att.line_id, lm.line_name, att.year_id, ym.year_val, ym.leap_year, att.month_id, mm.month_val, mm.month_days, att.total_duty,
                att_d.guard_id, gm.guard_name, gm.guard_code, att_d.rank_id, rm.rank_name,
                att_d.day_1, att_d.day_2, att_d.day_3, att_d.day_4, att_d.day_5, att_d.day_6, att_d.day_7, att_d.day_8, att_d.day_9, att_d.day_10, 
                att_d.day_11, att_d.day_12, att_d.day_13, att_d.day_14, att_d.day_15, att_d.day_16, att_d.day_17, att_d.day_18, att_d.day_19, att_d.day_20, 
                att_d.day_21, att_d.day_22, att_d.day_23, att_d.day_24, att_d.day_25, att_d.day_26, att_d.day_27, att_d.day_28, att_d.day_29, att_d.day_30, att_d.day_31,
                att.attendance_status
            FROM t_t_attendance_details AS att_d
            LEFT JOIN t_t_attendance AS att ON att_d.attendance_id = att.attendance_id
            LEFT JOIN line_master AS lm ON att.line_id = lm.line_id 
            LEFT JOIN year_master AS ym ON att.year_id = ym.year_id
            LEFT JOIN month_master AS mm ON att.month_id = mm.month_id
            LEFT JOIN guard_master AS gm ON att_d.guard_id = gm.guard_id
            LEFT JOIN rank_master AS rm ON att_d.rank_id = rm.rank_id
            WHERE att_d.attendance_id = ?
            AND att.d_status = 0
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
                FROM t_t_attendance
                WHERE line_id = ?
                AND year_id = ?
                AND month_id = ?
                AND d_status = 0
                AND attendance_id != ?
            `;
            val = [data.line_id, data.year_id, data.month_id, data.attendance_id];
        } else {
            qry = `
                SELECT attendance_id 
                FROM t_t_attendance
                WHERE line_id = ?
                AND year_id = ?
                AND month_id = ?
                AND d_status = 0
            `;
            val = [data.line_id, data.year_id, data.month_id];
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
            INSERT INTO t_t_attendance SET
                line_id = ?,
                year_id = ?,
                month_id = ?,
                total_duty = ?,
                attendance_status = 1,
                created_at = NOW(),
                created_by = ?
        `;
        let val = [
            data.line_id,
            data.year_id,
            data.month_id,
            data.total_duty,
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
    createAttendanceDetails: async (data, attendance_id, emp_id, connection) => {
        let qry = `
            INSERT INTO t_t_attendance_details SET
                attendance_id = ?,
                guard_id = ?,
                rank_id = ?,
                day_1 = ?,
                day_2 = ?,
                day_3 = ?,
                day_4 = ?,
                day_5 = ?,
                day_6 = ?,
                day_7 = ?,
                day_8 = ?,
                day_9 = ?,
                day_10 = ?,
                day_11 = ?,
                day_12 = ?,
                day_13 = ?,
                day_14 = ?,
                day_15 = ?,
                day_16 = ?,
                day_17 = ?,
                day_18 = ?,
                day_19 = ?,
                day_20 = ?,
                day_21 = ?,
                day_22 = ?,
                day_23 = ?,
                day_24 = ?,
                day_25 = ?,
                day_26 = ?,
                day_27 = ?,
                day_28 = ?,
                day_29 = ?,
                day_30 = ?,
                day_31 = ?,
                created_at = NOW(),
                created_by = ?
        `;
        let val = [
            attendance_id,
            data.guard_id,
            data.rank_id,
            data.day_1,
            data.day_2,
            data.day_3,
            data.day_4,
            data.day_5,
            data.day_6,
            data.day_7,
            data.day_8,
            data.day_9,
            data.day_10,
            data.day_11,
            data.day_12,
            data.day_13,
            data.day_14,
            data.day_15,
            data.day_16,
            data.day_17,
            data.day_18,
            data.day_19,
            data.day_20,
            data.day_21,
            data.day_22,
            data.day_23,
            data.day_24,
            data.day_25,
            data.day_26,
            data.day_27,
            data.day_28,
            data.day_29,
            data.day_30,
            data.day_31,
            emp_id
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
            UPDATE t_t_attendance SET
                line_id = ?,
                year_id = ?,
                month_id = ?,
                total_duty = ?,
                attendance_status = ?,
                updated_at = NOW(),
                updated_by = ?
            WHERE attendance_id = ?
        `;
        let val = [
            data.line_id,
            data.year_id,
            data.month_id, 
            data.total_duty,
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
    updateAttendanceDetails: async (data, attendance_id, emp_id, connection) => {
        let qry = `
            UPDATE t_t_attendance_details SET
                guard_id = ?,
                rank_id = ?,
                day_1 = ?,
                day_2 = ?,
                day_3 = ?,
                day_4 = ?,
                day_5 = ?,
                day_6 = ?,
                day_7 = ?,
                day_8 = ?,
                day_9 = ?,
                day_10 = ?,
                day_11 = ?,
                day_12 = ?,
                day_13 = ?,
                day_14 = ?,
                day_15 = ?,
                day_16 = ?,
                day_17 = ?,
                day_18 = ?,
                day_19 = ?,
                day_20 = ?,
                day_21 = ?,
                day_22 = ?,
                day_23 = ?,
                day_24 = ?,
                day_25 = ?,
                day_26 = ?,
                day_27 = ?,
                day_28 = ?,
                day_29 = ?,
                day_30 = ?,
                day_31 = ?,
                updated_at = NOW(),
                updated_by = ?
            WHERE attendance_id = ?
        `;
        let val = [
            data.guard_id,
            data.rank_id,
            data.day_1,
            data.day_2,
            data.day_3,
            data.day_4,
            data.day_5,
            data.day_6,
            data.day_7,
            data.day_8,
            data.day_9,
            data.day_10,
            data.day_11,
            data.day_12,
            data.day_13,
            data.day_14,
            data.day_15,
            data.day_16,
            data.day_17,
            data.day_18,
            data.day_19,
            data.day_20,
            data.day_21,
            data.day_22,
            data.day_23,
            data.day_24,
            data.day_25,
            data.day_26,
            data.day_27,
            data.day_28,
            data.day_29,
            data.day_30,
            data.day_31, 
            emp_id, 
            attendance_id
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
            UPDATE t_t_attendance SET
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