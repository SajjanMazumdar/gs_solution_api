
const userModel = {
    getUser: async (user, connection) => {
        let qry = `
            SELECT em.emp_id, em.emp_code, em.emp_name, em.line_ids, em.branch_ids, em.emp_status, em.emp_password,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'menu_id', mp.menu_id,
                    'unique_id', mp.unique_id,
                    'parent_id', mp.parent_id,
                    'menu_icon', mp.menu_icon,
                    'menu_label', mp.menu_label,
                    'menu_route', mp.menu_route,
                    'menu_order', mp.menu_order,
                    'menu_status', mp.menu_status
                )
            ) AS emp_menus
            FROM emp_master AS em
            LEFT JOIN menu_permission AS mp ON em.emp_id = mp.emp_id
            WHERE em.d_status = 0
            AND em.emp_code = ?
            AND em.emp_password = ?
            GROUP BY em.emp_id
        `;
        let val = [user.emp_code, user.emp_password];
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

module.exports = userModel;