
const farmerModel = {
    getFarmerList: async (connection) => {
        let qry = `
            SELECT 
                fm.farmer_id, fm.farmer_code, fm.first_name, fm.middle_name, fm.last_name, 
                CONCAT(fm.first_name, fm.middle_name, fm.last_name) AS farmer_name, fm.address_line1, fm.address_line2, fm.pin_code, fm.contact_no, 
                fm.state_id, sm.state_name, fm.district_id, dm.district_name, fm.branch_id, bm.branch_name, bm.branch_code, fm.line_id, lm.line_name, lm.line_code,
                fm.village_id, vm.village_name, vm.village_code, fm.emp_id, em.emp_name,

                fm.aggrement_no, fm.aggrement_status, fm.aadhar_no, fm.aadhar_copy, fm.pan_no, fm.pan_copy, fm.passport_photo, 
                fm.farm_history_report, fm.electricity_no, fm.electricity_paper, fm.env_consent_no, fm.env_consent_date, fm.env_consent_status, 
                fm.naksha_copy, fm.khasra_copy, fm.b1_copy, fm.p2_copy, fm.rin_pustika, fm.panchayat_noc, fm.noc_date, fm.land_lease, 
                fm.bank_id, fbm.bank_name, fbm.bank_code, 
                fm.account_no, fm.ifsc_code, fm.passbook_copy, fm.cheque_no1, fm.cheque_no2, fm.cheque_no3, fm.cheque_status, 

                fm.guarantor_name, fm.guarantor_aadhar_no, fm.guarantor_aadhar_copy, fm.guarantor_passport_photo, 
                fm.guarantor_bank_id, gbm.bank_name AS guarantor_bank_name, gbm.bank_code AS guarantor_bank_code,
                fm.guarantor_account_no, fm.guarantor_ifsc_code, fm.guarantor_passbook_copy, 
                fm.guarantor_cheque_no1, fm.guarantor_cheque_no2, fm.guarantor_cheque_no3, fm.guarantor_cheque_status, 
                fm.branch_manager_status, fm.legal_officer_status, fm.finance_head_status, fm.d_status
            FROM farmer_master AS fm
            LEFT JOIN state_master AS sm ON fm.state_id = sm.state_id
            LEFT JOIN district_master AS dm ON fm.district_id = dm.district_id
            LEFT JOIN branch_master AS bm ON fm.branch_id = bm.branch_id
            LEFT JOIN line_master AS lm ON fm.line_id = lm.line_id
            LEFT JOIN village_master As vm ON fm.village_id = vm.village_id
            LEFT JOIN emp_master AS em ON fm.emp_id = em.emp_id
            LEFT JOIN bank_master AS fbm ON fm.bank_id = fbm.bank_id
            LEFT JOIN bank_master AS gbm ON fm.guarantor_bank_id = gbm.bank_id
            WHERE fm.d_status = 0
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
    getFarmerById: async (farmer_id, connection) => {
        let qry = `
            SELECT 
                fm.farmer_id, fm.farmer_code, fm.first_name, fm.middle_name, fm.last_name, fm.address_line1, fm.address_line2, fm.pin_code, fm.contact_no, 
                fm.state_id, sm.state_name, fm.district_id, dm.district_name, fm.branch_id, bm.branch_name, bm.branch_code, fm.line_id, lm.line_name, lm.line_code,
                fm.village_id, vm.village_name, fm.emp_id, em.emp_name,

                fm.aggrement_no, fm.aggrement_status, fm.aadhar_no, fm.aadhar_copy, fm.pan_no, fm.pan_copy, fm.passport_photo, 
                fm.farm_history_report, fm.electricity_no, fm.electricity_paper, fm.env_consent_no, fm.env_consent_date, fm.env_consent_status, 
                fm.naksha_copy, fm.khasra_copy, fm.b1_copy, fm.p2_copy, fm.rin_pustika, fm.panchayat_noc, fm.noc_date, fm.land_lease, 
                fm.bank_id, fbm.bank_name, fbm.bank_code, 
                fm.account_no, fm.ifsc_code, fm.passbook_copy, fm.cheque_no1, fm.cheque_no2, fm.cheque_no3, fm.cheque_status, 

                fm.guarantor_name, fm.guarantor_aadhar_no, fm.guarantor_aadhar_copy, fm.guarantor_passport_photo, 
                fm.guarantor_bank_id, gbm.bank_name AS guarantor_bank_name, gbm.bank_code AS guarantor_bank_code,
                fm.guarantor_account_no, fm.guarantor_ifsc_code, fm.guarantor_passbook_copy, 
                fm.guarantor_cheque_no1, fm.guarantor_cheque_no2, fm.guarantor_cheque_no3, fm.guarantor_cheque_status, 
                fm.branch_manager_status, fm.legal_officer_status, fm.finance_head_status, fm.d_status
            FROM farmer_master AS fm
            LEFT JOIN state_master AS sm ON fm.state_id = sm.state_id
            LEFT JOIN district_master AS dm ON fm.district_id = dm.district_id
            LEFT JOIN branch_master AS bm ON fm.branch_id = bm.branch_id
            LEFT JOIN line_master AS lm ON fm.line_id = lm.line_id
            LEFT JOIN village_master As vm ON fm.village_id = vm.village_id
            LEFT JOIN emp_master AS em ON fm.emp_id = em.emp_id
            LEFT JOIN bank_master AS fbm ON fm.bank_id = fbm.bank_id
            LEFT JOIN bank_master AS gbm ON fm.guarantor_bank_id = gbm.bank_id
            WHERE fm.farmer_id = ?
            AND fm.d_status = 0
        `;
        let val = [farmer_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    checkFarmerExists: async (data, connection) => {

        let qry;
        let val;
        if (data.farmer_id > 0) {
            qry = `
                SELECT farmer_id 
                FROM farmer_master
                WHERE state_id = ? 
                AND district_id = ? 
                AND farmer_code = ?
                AND d_status = 0
                AND farmer_id != ?
            `;
            val = [data.state_id, data.district_id, data.farmer_code, data.farmer_id];
        } else {
            qry = `
                SELECT farmer_id 
                FROM farmer_master
                WHERE state_id = ? 
                AND district_id = ? 
                AND farmer_code = ?
                AND d_status = 0
            `;
            val = [data.state_id, data.district_id, data.farmer_code];
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
    createFarmer: async (data, connection) => {
        let qry = `
            INSERT INTO farmer_master SET
                farmer_code = ?,
                state_id = ?,
                district_id = ?,
                branch_id = ?,
                line_id = ?,
                village_id = ?,
                aggrement_status = ?,
                aadhar_no = ?,
                aadhar_copy = ?,
                pan_no = ?,
                pan_copy = ?,
                passport_photo = ?,
                farm_history_report = ?,
                electricity_no = ?,
                electricity_paper = ?,
                env_consent_no = ?,
                env_consent_date = STR_TO_DATE(?,'%d-%m-%Y'),
                env_consent_status = ?,
                naksha_copy = ?,
                khasra_copy = ?,
                b1_copy = ?,
                p2_copy = ?,
                rin_pustika = ?,
                panchayat_noc = ?,
                noc_date = STR_TO_DATE(?,'%d-%m-%Y'),
                land_lease = ?,
                bank_id = ?,
                account_no = ?,
                ifsc_code = ?,
                passbook_copy = ?,
                cheque_no1 = ?,
                cheque_no2 = ?,
                cheque_no3 = ?,
                cheque_status = ?,
                guarantor_aadhar_no = ?,
                guarantor_aadhar_copy = ?,
                guarantor_passport_photo = ?,
                guarantor_bank_id = ?,
                guarantor_account_no = ?,
                guarantor_ifsc_code = ?,
                guarantor_passbook_copy = ?,
                guarantor_cheque_no1 = ?,
                guarantor_cheque_no2 = ?,
                guarantor_cheque_no3 = ?,
                guarantor_cheque_status = ?,
                first_name = ?,
                middle_name = ?,
                last_name = ?,
                address_line1 = ?,
                address_line2 = ?,
                pin_code = ?,
                contact_no = ?,
                guarantor_name = ?,
                emp_id = ?,
                aggrement_no = ?
        `;
        let val = [
            data.farmer_code,
            data.state_id,
            data.district_id,
            data.branch_id,
            data.line_id,
            data.village_id,
            data.aggrement_status,
            data.aadhar_no,
            data.aadhar_copy,
            data.pan_no,
            data.pan_copy,
            data.passport_photo,
            data.farm_history_report,
            data.electricity_no,
            data.electricity_paper,
            data.env_consent_no,
            data.env_consent_date,
            data.env_consent_status,
            data.naksha_copy,
            data.khasra_copy,
            data.b1_copy,
            data.p2_copy,
            data.rin_pustika,
            data.panchayat_noc,
            data.noc_date,
            data.land_lease,
            data.bank_id,
            data.account_no,
            data.ifsc_code,
            data.passbook_copy,
            data.cheque_no1,
            data.cheque_no2,
            data.cheque_no3,
            data.cheque_status,
            data.guarantor_aadhar_no,
            data.guarantor_aadhar_copy,
            data.guarantor_passport_photo,
            data.guarantor_bank_id,
            data.guarantor_account_no,
            data.guarantor_ifsc_code,
            data.guarantor_passbook_copy,
            data.guarantor_cheque_no1,
            data.guarantor_cheque_no2,
            data.guarantor_cheque_no3,
            data.guarantor_cheque_status,
            data.first_name,
            data.middle_name,
            data.last_name,
            data.address_line1,
            data.address_line2,
            data.pin_code,
            data.contact_no,
            data.guarantor_name,
            data.emp_id,
            data.aggrement_no
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
    updateFarmer: async (data, connection) => {
        let qry = `
            UPDATE farmer_master SET
                farmer_code = ?,
                state_id = ?,
                district_id = ?,
                branch_id = ?,
                line_id = ?,
                village_id = ?,
                aggrement_status = ?,
                aadhar_no = ?,
                aadhar_copy = ?,
                pan_no = ?,
                pan_copy = ?,
                passport_photo = ?,
                farm_history_report = ?,
                electricity_no = ?,
                electricity_paper = ?,
                env_consent_no = ?,
                env_consent_date = STR_TO_DATE(?,'%d-%m-%Y'),
                env_consent_status = ?,
                naksha_copy = ?,
                khasra_copy = ?,
                b1_copy = ?,
                p2_copy = ?,
                rin_pustika = ?,
                panchayat_noc = ?,
                noc_date = STR_TO_DATE(?,'%d-%m-%Y'),
                land_lease = ?,
                bank_id = ?,
                account_no = ?,
                ifsc_code = ?,
                passbook_copy = ?,
                cheque_no1 = ?,
                cheque_no2 = ?,
                cheque_no3 = ?,
                cheque_status = ?,
                guarantor_aadhar_no = ?,
                guarantor_aadhar_copy = ?,
                guarantor_passport_photo = ?,
                guarantor_bank_id = ?,
                guarantor_account_no = ?,
                guarantor_ifsc_code = ?,
                guarantor_passbook_copy = ?,
                guarantor_cheque_no1 = ?,
                guarantor_cheque_no2 = ?,
                guarantor_cheque_no3 = ?,
                guarantor_cheque_status = ?,
                first_name = ?,
                middle_name = ?,
                last_name = ?,
                address_line1 = ?,
                address_line2 = ?,
                pin_code = ?,
                contact_no = ?,
                guarantor_name = ?,
                emp_id = ?,
                aggrement_no = ?
            WHERE farmer_id = ?
        `;
        let val = [
            data.farmer_code,
            data.state_id,
            data.district_id,
            data.branch_id,
            data.line_id,
            data.village_id,
            data.aggrement_status,
            data.aadhar_no,
            data.aadhar_copy,
            data.pan_no,
            data.pan_copy,
            data.passport_photo,
            data.farm_history_report,
            data.electricity_no,
            data.electricity_paper,
            data.env_consent_no,
            data.env_consent_date,
            data.env_consent_status,
            data.naksha_copy,
            data.khasra_copy,
            data.b1_copy,
            data.p2_copy,
            data.rin_pustika,
            data.panchayat_noc,
            data.noc_date,
            data.land_lease,
            data.bank_id,
            data.account_no,
            data.ifsc_code,
            data.passbook_copy,
            data.cheque_no1,
            data.cheque_no2,
            data.cheque_no3,
            data.cheque_status,
            data.guarantor_aadhar_no,
            data.guarantor_aadhar_copy,
            data.guarantor_passport_photo,
            data.guarantor_bank_id,
            data.guarantor_account_no,
            data.guarantor_ifsc_code,
            data.guarantor_passbook_copy,
            data.guarantor_cheque_no1,
            data.guarantor_cheque_no2,
            data.guarantor_cheque_no3,
            data.guarantor_cheque_status,
            data.first_name,
            data.middle_name,
            data.last_name,
            data.address_line1,
            data.address_line2,
            data.pin_code,
            data.contact_no,
            data.guarantor_name,
            data.emp_id,
            data.aggrement_no,
            data.farmer_id
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
    deleteFarmer: async (data, connection) => {
        let qry = `
            UPDATE farmer_master SET
                d_status = 1
            WHERE farmer_id = ?
        `;
        let val = [data.farmer_id];
        let query = connection.format(qry, val);
        return connection.query(query)
            .then(([result]) => {
                return { error: null, result };
            })
            .catch((err) => {
                return { error: err };
            });
    },
    approvalFarmer: async (data, connection) => {
        let qry;
        let val;

        if (data.flag == 'branch') {
            qry = `
                UPDATE farmer_master SET
                    branch_manager_status = ?
                WHERE farmer_id = ?
            `;
            val = [data.status, data.farmer_id];
        } else if (data.flag == 'legal') {
            qry = `
                UPDATE farmer_master SET
                    legal_officer_status = ?
                WHERE farmer_id = ?
            `;
            val = [data.status, data.farmer_id];
        } else if (data.flag == 'financial') {
            qry = `
                UPDATE farmer_master SET
                    finance_head_status = ?
                WHERE farmer_id = ?
            `;
            val = [data.status, data.farmer_id];
        }

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

module.exports = farmerModel;