
import './TimeSheetsTable.scss';
import React, { useState, useEffect } from 'react';
import { PageHeader, Table, Popconfirm, Button } from 'antd';

import TimeSheetService from '../../services/timesheet.service';
import UserService from "../../services/user.service";
import AuthService from "../../services/auth.service";

import ModalTimeSheetDetails from '../ModalTimeSheetDetails/ModalTimeSheetDetails';
import ModalNewTimeSheet from '../ModalNewTimeSheet/ModalNewTimeSheet';

const timeSheetDetails = {
    id: null,
    key: "",
    name: "",
    hours: 0,
    data: null,
};

const department = [{
    key: null,
    id: null,
    name: "prueba"
}];

const TimeSheetsTable = (props) => {

    /**
     * React Hooks
     * https://reactjs.org/docs/hooks-reference.html
     */
    const [visibleDetails, setVisibleDetails] = useState(false);
    const [visibleNew, setVisibleNew] = useState(false);
    const [detailsData, setDetails] = useState(timeSheetDetails);
    const [departmentData, setDepartment] = useState(department);

    const [data, setData] = useState([]);

    useEffect(() => {
        updateTable();
    }, []);

    /** Service methods **/

    /** Handle actions in the Form **/

    /** General Methods **/
    const updateTable = () => {

        TimeSheetService.getAll().then(res => {
            
            const data = [];

            res.data.forEach((timesheet, index ) => {

                console.log(timesheet);

                data.push({
                    key: index.toString(),
                    id: timesheet.id,
                    name: timesheet.name,
                    hours: timesheet.hours,
                    data: timesheet
                });
            });
            setData(data);
        });
    };

    //modal new timeSheet
    const onCreate = (timeSheet, details, values) => {
        
        let user = AuthService.getCurrentUserData();
        console.log(user);
        details.employeeId = user.data.id;

        timeSheet.details = [details];
        console.log(timeSheet);
        setVisibleNew(false);

        TimeSheetService.create(timeSheet).then(res => {
            if (res.status === 200) {
                updateTable();
            }
        });
    };

    const remove = (record) => {
        TimeSheetService.remove(record.id).then(res => {
            if (res.status === 200) {
                const dataSource = [...data];
                setData(dataSource.filter(item => item.key !== record.key));
            }
        });
    };

    //modal new timeSheet
    const add = () => {
        setVisibleNew(true);
    }

    //modal timeSheetDetail
    const details = (record) => {
        console.log("DETAILS");
        console.log(record);

        try {
            record.data.details.forEach((detail, index ) => {

                let departments = [];

                UserService.get(detail.employeeId)
                .then(res => {
                    
                    console.log(res);

                    departments.push({
                        key: res.data.department.id.toString(),
                        id: res.data.department.id,
                        department: res.data.department.name,
                        hours: getHours(detail)
                    });

                    setDetails(record);
                    setDepartment(departments);
                    setVisibleDetails(true);
                })
                .catch(err => {
                    console.log(err);
                });
            });

        }
        catch(err){
            console.error(`Error trying show details ${err}`);
        }
    };

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
            title: 'Id',
            dataIndex: 'id',
            align: 'center'
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Hours',
            dataIndex: 'hours',
            align: 'center'
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) =>
                <>
                <a onClick={() => details(record)}>
                    Details
                </a>
                &nbsp;
                &nbsp;
                <Popconfirm title="Sure to delete?" onConfirm={() => remove(record)}>
                    <a>Delete</a>
                </Popconfirm>
                </>
        }
    ];

    return (
        <>
            <PageHeader
                className="site-page-header"
                title="TimeSheets"
            />

            <Button onClick={add} type="primary" style={{ marginBottom: 15 }}>
                Add New
            </Button>

            {/*  */}
            <Table 
                columns={columns}
                dataSource={data}
                bordered
            />

            {/*  */}
            <ModalTimeSheetDetails
                visible={visibleDetails}
                onCancel={() => {
                    setVisibleDetails(false);
                }}
                timeSheetDetails={detailsData}
                departmentData={departmentData}
            />

            {/*  */}
            <ModalNewTimeSheet
                visible={visibleNew}
                onCreate={onCreate}
                onCancel={() => {
                    setVisibleNew(false);
                }}
            />
        </>
    )
};

export default TimeSheetsTable;