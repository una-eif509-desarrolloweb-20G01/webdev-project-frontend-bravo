
import './ApproveTimeSheet.scss';
import React, { useState, useEffect } from 'react';
import { PageHeader, Table, Descriptions, Select, Switch } from 'antd';

import TimeSheetService from '../../services/timesheet.service';
import TimeSheetDetailService from '../../services/timesheetDetails.service';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';

const initialCurrentUser = {
    user: {
        id: null,
        name: ''
    },
    role: {
        id: null,
        name: ""
    },
    department: {
        id: null,
        name: ""
    }
}

const visibleTable = false;

const ApproveTimeSheet = (props) => {

    /**
     * React Hooks
     * https://reactjs.org/docs/hooks-reference.html
     */
    const [currentUser, setCurrentUser] = useState(initialCurrentUser);
    const [data, setData] = useState([]);
    const [options, setOptions] = useState([]);
    const [visible, setVisible] = useState(visibleTable);

    useEffect(() => {

        //información del usuario logueado
        showInfo();

        //lista de timeSheets en el Select
        timeSheetsOptions();
    }, []);

    /** Service methods **/

    /** Handle actions in the Form **/

    //seleccionar timeSheet
    const handleChange = (option) => {
        console.log(option);

        TimeSheetService.get(option.value).then(res => {
            
            console.log(res);
            let timeSheet = res.data;
            const data = [];

            timeSheet.details.forEach((detail, index) => {

                UserService.get(detail.employeeId)
                .then(res_user => {
                    
                    console.log(res_user);
                    
                    data.push({
                        key: index.toString(),
                        employee: `${res_user.data.firstName} ${res_user.data.lastName}`,
                        weekHours: getHours(detail),
                        approved: detail.approved,
                        data: detail
                    });
                    console.log(data);
                    
                    if(index == timeSheet.details.length - 1){
                        setData(data);
                        setVisible(true);
                    }
                })
                .catch(err => {
                    console.error(`Error trying show details timeSheets ${err}`);
                });
            });
        });
    };

    const onChangeSwitch = (record) => {
        console.log(record);

        record.approved = !record.approved;
        record.data.approved = !record.data.approved;

        console.log(record.data);

        try {

            TimeSheetDetailService.update(record.data.id, record.data).then(res => {
                
                console.log(res);
                
                if (res.status === 200) {
                    
                }
                else {
                    console.error(`Error trying change approve`);
                }
            });
        }
        catch(err) {
            console.error(`Error trying change approve status ${err}`);
        }
    };

    /** General Methods **/

    //información del usuario logueado
    const showInfo = () => {

        let user = AuthService.getCurrentUserData();
        console.log(user);

        setCurrentUser({
            user: {
                id: user.data.id,
                name: `${user.data.firstName} ${user.data.lastName}`,
            },
            role: user.data.role,
            department: user.data.department
        });
    };
    const timeSheetsOptions = () => {

        let user = AuthService.getCurrentUserData();
        console.log(user);

        TimeSheetService.getAll().then(res => {
            
            console.log(res);

            const data = [];

            res.data.forEach((timeSheet, index) => {

                let exist = timeSheet.details.find((detail) => {
                    return user.data.id == detail.approvingManagerId;
                });

                if(exist){
                    data.push({
                        value: timeSheet.id,
                        label: timeSheet.name
                    });
                }
            });

            setOptions(data);
        });
    };
    //obtener horas
    const getHours = detail => {
        let totalHours = 0;
        totalHours = totalHours + detail.hoursMonday;
        totalHours = totalHours + detail.hoursTuesday;
        totalHours = totalHours + detail.hoursWednesday;
        totalHours = totalHours + detail.hoursThursday;
        totalHours = totalHours + detail.hoursFriday;
        totalHours = totalHours + detail.hoursSaturday;
        totalHours = totalHours + detail.hoursSunday;
        return totalHours;
    };

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'employee',
            align: 'center'
        },
        {
            title: 'Week Hours',
            dataIndex: 'weekHours',
            align: 'center'
        },
        {
            title: 'Approve',
            key: 'approve',
            align: 'center',
            render: (_, record) => {
                console.log(record.approved);
                return record.approved
                ? <Switch onChange={() => onChangeSwitch(record)} checkedChildren="Yes" unCheckedChildren="No" defaultChecked />
                : <Switch onChange={() => onChangeSwitch(record)} checkedChildren="Yes" unCheckedChildren="No" />                
            }
        }
    ];

    return (
        <>

            <PageHeader
                className="site-page-header"
                title="Approve TimeSheets"
            />
            
            <Descriptions>
                <Descriptions.Item label="User">{currentUser.user.name}</Descriptions.Item>
            </Descriptions>
            <Descriptions>
                <Descriptions.Item label="Role">{currentUser.role.name}</Descriptions.Item>
            </Descriptions>
            <Descriptions>
                <Descriptions.Item label="Department">{currentUser.department.name}</Descriptions.Item>
            </Descriptions>
            <Descriptions>
                <Descriptions.Item label="TimeSheet">
                    <Select
                        showSearch
                        labelInValue
                        optionFilterProp="label"
                        name="timeSheet"
                        onChange={handleChange}
                        options={options}
                        placeholder="Select TimeSheet"
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    />
                </Descriptions.Item>
            </Descriptions>


            {/*  */}
            <Table 
                className={
                    !visible ? "hide-table-approve" : ""
                }
                columns={columns}
                dataSource={data}
                bordered
            />

        </>
    )
};

export default ApproveTimeSheet;