import React from 'react';
import { Table, Modal, Descriptions, Popconfirm } from 'antd';
import TimeSheetDetailService from '../../services/timesheetDetails.service';

const ModalTimeSheetDetails = ({ visible, onUpdate, onCancel, timeSheetDetail, currentUser }) => {

    /** General Methods **/

    const columns = [
        {
            title: 'Department',
            dataIndex: 'department',
        },
        {
            title: 'Hours',
            dataIndex: 'hours',
            align: 'center'
        },
        {
            title: 'Options',
            key: 'options',
            align: 'center',
            render: (_, record) => {

                console.log(record.employeeId);
                console.log(currentUser.user.id);
                console.log("---");

                return currentUser.user.id === record.employeeId ?
                    <Popconfirm title="Sure to delete?" onConfirm={() => remove(record)}>
                        <a>Delete</a>
                    </Popconfirm>
                : ''
            }
        }
    ];

    const remove = (record) => {

        console.log(record);

        try {

            TimeSheetDetailService.remove(record.id_detail).then(res => {
                if (res.status === 200) {
                    onUpdate();
                }
            });
        }
        catch(err) {
            console.error(`Error trying change approve status ${err}`);
        }
    };

    return (
        <Modal
            visible={visible}
            title="TimeSheet Details"
            cancelText="Close"
            onCancel={onCancel}
            okButtonProps={{ style: { display: 'none' } }}
        >
            <Descriptions>
                <Descriptions.Item label="Name">{timeSheetDetail.name}</Descriptions.Item>
            </Descriptions>

            <Descriptions>
                <Descriptions.Item label="Hours">{timeSheetDetail.hours}</Descriptions.Item>
            </Descriptions>

            <Descriptions>
                <Descriptions.Item label="History"></Descriptions.Item>
            </Descriptions>

            {/*  */}
            <Table 
                columns={columns}
                dataSource={timeSheetDetail.rows}
                bordered
            />
        </Modal>
    );
};

export default ModalTimeSheetDetails;
