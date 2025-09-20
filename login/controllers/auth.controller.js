const jwt = require('jsonwebtoken');
const pool = require('../configs/mysql2.config');
const logger = require('../logs/logger');
const authModel = require('../models/auth.model');
const emptyArray = new Array();

let authController = {
    userLogin: async (reqBody, cb) => {
        let connection;
        let result;
        try {
            connection = await pool.promise().getConnection();
            await connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await connection.beginTransaction();

            let checkUser = await authModel.getUser(reqBody, connection);
            if (checkUser.error) throw new Error(checkUser.error);
            
            if (checkUser.result.length > 0) {
                const token = jwt.sign(
                    { emp_id: checkUser.result[0].emp_id, emp_name: checkUser.result[0].emp_name },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                let menuItems = [];
                let emp_menus = checkUser.result[0].emp_menus;

                for (let i = 0; i < emp_menus.length; i++) {
                    if (emp_menus[i].parent_id == 0 && emp_menus[i].menu_status != 0) {
                        emp_menus[i].subItems = [];
                        menuItems.push(emp_menus[i]);
                    }
                }

                for (let i = 0; i < emp_menus.length; i++) {
                    if (emp_menus[i].parent_id > 0 && emp_menus[i].menu_status != 0) {
                        let parentIndex = menuItems.findIndex(menu => menu.menu_id == emp_menus[i].parent_id);
                        if (parentIndex !== -1) {
                            menuItems[parentIndex].subItems.push(emp_menus[i]);
                        }
                    }
                }

                result = {
                    token: token,
                    emp_id: checkUser.result[0].emp_id, 
                    emp_name: checkUser.result[0].emp_name,
                    menuItems: menuItems
                }
                await connection.commit();
                return cb(null, result);
            } else {
                logger.error("Invalid Credentials: ", reqBody);
                await connection.commit();
                return cb(true, {message: "Invalid Credentials." });
            }

        } catch (error) {
            logger.error("Error in userLogin: ", error);
            await connection.rollback();
            return cb(true, error);
        } finally {
            connection.release();
        }
    }
};

module.exports = authController;

// exports.login = async (req, res) => {
//     const { username, password } = req.body;
//     if (!username || !password) {
//         return res.status(400).json({
//             error: true,
//             status: 400,
//             message: "Username and password are required"
//         });
//     }

//     try {
//         const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

//         if (rows.length === 0) {
//             return res.status(401).json({
//                 error: true,
//                 status: 401,
//                 message: "Invalid username"
//             });
//         }

//         const user = rows[0];

//         if (user.password !== password) {
//             return res.status(401).json({
//                 error: true,
//                 status: 401,
//                 message: "Invalid password"
//             });
//         }

//         const token = jwt.sign(
//             { user_id: user.id, username: user.username },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         return res.status(200).json({
//             error: false,
//             status: 200,
//             message: "Login successful",
//             token,
//             data: {
//                 user_id: user.id,
//                 username: user.username
//             }
//         });

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             error: true,
//             status: 500,
//             message: "Internal server error"
//         });
//     }
// };
