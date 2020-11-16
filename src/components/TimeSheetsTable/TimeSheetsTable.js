
import './TimeSheetsTable.scss';
import React, { useState, useEffect } from 'react';
import { PageHeader, Table, Popconfirm, Button, Alert } from 'antd';

import TimeSheetService from '../../services/timesheet.service';
import UserService from "../../services/user.service";
import AuthService from "../../services/auth.service";

import ModalTimeSheetDetails from '../ModalTimeSheetDetails/ModalTimeSheetDetails';
import ModalNewTimeSheet from '../ModalNewTimeSheet/ModalNewTimeSheet';
import ModalAddDetail from '../ModalAddDetail/ModalAddDetail';

const InitialTimeSheet = {
    id: null,
    key: "",
    name: "",
    hours: 0,
    data: {},
    rows: []
};

const initialCurrentInfo = {
    user: {
        id: null
    },
    department: {
        id: null,
        name: ''
    }
}

const initialAddDetail = {
    details: [],
    id: null,
    name: '',
    hours: 0
}

const TimeSheetsTable = (props) => {

    /**
     * React Hooks
     * https://reactjs.org/docs/hooks-reference.html
     */
    const [currentUser, setCurrentInfo] = useState(initialCurrentInfo);

    const [visibleDetails, setVisibleDetails] = useState(false);
    const [visibleNew, setVisibleNew] = useState(false);
    const [visibleAdd, setVisibleAdd] = useState(false);

    const [timeSheetDetail, setTimeSheet] = useState(InitialTimeSheet);
    const [managerList, setManagerList] = useState([]);

    const [addDetail, setAddDetail] = useState(initialAddDetail);

    const [data, setData] = useState([]);

    const [message, setMessage] = useState(false);

    useEffect(() => {
        //información del usuario logueado
        showInfo();

        updateTable();

        getManagerList();
    }, []);

    /** Service methods **/

    /** Handle actions in the Form **/

    /** General Methods **/
    const getManagerList = () => {

        UserService.getAll().then(res => {

            console.log(res);

            const data = [];

            res.data.forEach((user, index) => {

                if(user.role.name == 'ROLE_ADMIN'){
                    data.push({
                        value: user.id,
                        label: `${user.firstName} ${user.lastName}`
                    });
                }
            });

            setManagerList(data);
        });
    };

    //información del usuario logueado
    const showInfo = () => {

        let user = AuthService.getCurrentUserData();
        console.log(user);

        setCurrentInfo({
            user: {
                id: user.data.id
            },
            department: user.data.department
        });
    };

    const updateTable = () => {

        TimeSheetService.getAll().then(res => {
            
            const data = [];
            
            res.data.forEach((timesheet, index ) => {

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

    const onUpdateAddDetail = () => {
        setVisibleAdd(false);
        updateTable();
    };
    const onAddDetail = (approvingManagerId, details, values) => {

        let data = addDetail;
        details.employeeId = currentUser.user.id;
        details.approvingManagerId = approvingManagerId;
        data.details.push(details);

        TimeSheetService.update(data.id, data).then(res => {
            if (res.status === 200) {
                console.log(data);
                onUpdateAddDetail();
            }
        });
    };
    const onUpdateRemoveDatail = () => {
        setVisibleDetails(false);
        updateTable();
    };

    //modal new timeSheet
    const onCreateTimeSheet = (timeSheet, approvingManagerId, details, values) => {
        
        console.log(currentUser);

        details.employeeId = currentUser.user.id;
        details.approvingManagerId = approvingManagerId;

        timeSheet.details = [details];
        setVisibleNew(false);

        console.log(timeSheet);

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

    //modal add detail
    const addDetailModal = (record) => {

        validateAddDetail(record.data.details, (status) => {

            if(status){
                setAddDetail(record.data);
                setVisibleAdd(true);
            }
            else {
                setMessage(true);
                console.log("NO");
            }
        });
    };

    const validateAddDetail = (details, callback) => {

        details.forEach((detail, index ) => {

            UserService.get(detail.employeeId)
            .then(res => {
                
                if(res.data.department.id == currentUser.department.id){
                    callback(true);
                    return false;
                }
                if(index == details.length - 1){
                    callback(false);
                    return false;
                }
            })
            .catch(err => {
                console.log(err);
            });
        });
    };

    //modal new timeSheet
    const add = () => {
        setVisibleNew(true);
    }
    //modal timeSheet Detail
    const configDetails = (record) => {
        console.log("DETAILS");
        console.log(record);

        try {

            record.rows = [];

            record.data.details.forEach((detail, index ) => {

                UserService.get(detail.employeeId)
                .then(res => {
                    
                    console.log(res);

                    record.rows.push({
                        key: index.toString(),
                        employeeId: detail.employeeId,
                        id_detail: detail.id,
                        id_deparment: res.data.department.id,
                        department: res.data.department.name,
                        hours: getHours(detail)
                    });

                    if(index === record.data.details.length - 1){
                        setTimeSheet(record);
                        setVisibleDetails(true);
                    }
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
                    <a onClick={() => configDetails(record)}>
                        Details
                    </a>
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    <a onClick={() => addDetailModal(record)}>
                        Add Detail
                    </a>
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    <Popconfirm title="Sure to delete?" onConfirm={() => remove(record)}>
                        <a>Delete</a>
                    </Popconfirm>
                </>
        }
    ];

    const handleClose = () => {
        setMessage(false);
    };
    return (
        <>
            <PageHeader
                className="site-page-header"
                title="TimeSheets"
            />

            <Button onClick={add} type="primary" style={{ marginBottom: 15 }}>
                Add New
            </Button>

            {message ? (
                <Alert className="alert" message="Not the same department, please select other." type="warning" showIcon closable afterClose={handleClose}/>
            ) : null}

            {/*  */}
            <Table 
                columns={columns}
                dataSource={data}
                bordered
            />

            {/*  */}
            <ModalTimeSheetDetails
                visible={visibleDetails}
                onUpdate={() => onUpdateRemoveDatail()}
                onCancel={() => {
                    setVisibleDetails(false);
                }}
                timeSheetDetail={timeSheetDetail}
                currentUser={currentUser}
            />

            {/*  */}
            <ModalNewTimeSheet
                visible={visibleNew}
                onCreateTimeSheet={onCreateTimeSheet}
                onCancel={() => {
                    setVisibleNew(false);
                }}
                managerList={managerList}
            />

            {/*  */}
            <ModalAddDetail
                visible={visibleAdd}
                onAddDetail={onAddDetail}
                onCancel={() => {
                    setVisibleAdd(false);
                }}
                managerList={managerList}
            />
        </>
    )
};

export default TimeSheetsTable;