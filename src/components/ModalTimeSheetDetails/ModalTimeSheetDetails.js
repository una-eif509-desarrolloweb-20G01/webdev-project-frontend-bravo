import React from 'react';
import { Table, Modal, Descriptions } from 'antd';

const ModalTimeSheetDetails = ({ visible, onCancel, timeSheetDetails, departmentData }) => {

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
        }
    ];
    return (
        <Modal
            visible={visible}
            title="TimeSheet Details"
            cancelText="Close"
            onCancel={onCancel}
            okButtonProps={{ style: { display: 'none' } }}
        >
            <Descriptions>
                <Descriptions.Item label="Name">{timeSheetDetails.name}</Descriptions.Item>
            </Descriptions>

            <Descriptions>
                <Descriptions.Item label="Hours">{timeSheetDetails.hours}</Descriptions.Item>
            </Descriptions>

            <Descriptions>
                <Descriptions.Item label="History"></Descriptions.Item>
            </Descriptions>

            {/*  */}
            <Table 
                columns={columns}
                dataSource={departmentData}
                bordered
            />
        </Modal>
    );
};

export default ModalTimeSheetDetails;
