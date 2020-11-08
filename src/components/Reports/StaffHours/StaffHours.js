import './StaffHours.scss';
import React, { useState, useEffect } from 'react';
import { Table, Button, Select, Form, Typography  } from 'antd';
import TimeSheetService from '../../../services/timesheet.service';
import UserService from '../../../services/user.service';

const { Text } = Typography;

const layout = {
    labelCol: {
        offset: 0,
        span: 3,
    },
    wrapperCol: {
        offset: 0,
        span: 6,
    },
};

const tailLayout = {
    wrapperCol: {
        offset: 1,
        span: 6,
    },
};

const StaffHours = () => {
    const [form] = Form.useForm();
    const [timeSheets, setTimeSheets] = useState(new Map());
    const [users, setUsers] = useState(new Map());
    const [timeSheetSelectOptions, setTimeSheetSelectOptions] = useState([]);
    const [report, setReport] = useState(null);

    useEffect(() => {
        TimeSheetService.getAll().then(response => {
            const data = new Map();
            const options = [];

            response.data.forEach((timeSheet, index) => {
                options.push({
                    value: timeSheet.id,
                    label: timeSheet.name
                });

                data.set(timeSheet.id, timeSheet)
            });

            setTimeSheets(data);
            setTimeSheetSelectOptions(options);
        });

        UserService.getAll().then(response => {
            const data = new Map();

            response.data.forEach((user, index) => {
                data.set(user.id, user)
            });

            setUsers(data);
        });
    }, []);

    const generateReportId = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const onFinish = data => {
        let timeSheet = timeSheets.get(data.timesheet.value);
        alert(JSON.stringify(timeSheet));

        if (timeSheet && timeSheet.details && timeSheet.details.length > 0) {
            let user = users.get(timeSheet.details[0].employeeId);

            let newReport = {
                id: generateReportId(),
                department: user.department ? user.department.name : '',
                name: timeSheet.name,
                columns: [
                    {
                        title: 'Employee',
                        dataIndex: 'employee',
                        key: 'employee',
                    },
                    {
                        title: 'Type',
                        dataIndex: 'type',
                        key: 'type',
                    },
                    {
                        title: 'Hours for Week',
                        dataIndex: 'hoursForWeek',
                        key: 'hoursForWeek',
                    },
                ],
                data: timeSheet.details.map(detail => {
                    let user = users.get(detail.employeeId);

                    return {
                        employee: user.firstName + ' ' + user.lastName,
                        type: user.role.name === 'ROLE_ADMIN' ? 'Management' : 'Staff',
                        hoursForWeek: detail.hoursMonday +
                            detail.hoursTuesday +
                            detail.hoursWednesday +
                            detail.hoursThursday +
                            detail.hoursFriday +
                            detail.hoursSaturday +
                            detail.hoursSunday
                    }
                })
            };

            setReport(newReport);
        }
    };

    return (
        <>
            <h1>Staff Hours Report</h1>
            <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                <Form.Item
                    name="timesheet"
                    label="TimeSheet"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        showSearch
                        labelInValue
                        optionFilterProp="label"
                        name="timesheet"
                        options={timeSheetSelectOptions}
                        placeholder="Select a timesheet"
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" style={{ marginRight: "10px" }}>
                        Generate Report
                    </Button>
                </Form.Item>
            </Form>

            {report ?
                <div class="report">
                    <div class="report-header">
                        <div class="report-header-data">
                            <label>Report Id:</label>
                            {report.id}
                        </div>
                        <div class="report-header-data">
                            <label>Department:</label>
                            {report.department}
                        </div>
                        <div class="report-header-data">
                            <label>TimeSheet:</label>
                            {report.name}
                        </div>
                    </div>
                    <div class="report-body">
                        <Table dataSource={report.data}
                            columns={report.columns}
                            summary={pageData => {
                                let totalHours = 0;

                                pageData.forEach(({ hoursForWeek }) => {
                                    totalHours += hoursForWeek;
                                });

                                let averageHours = totalHours / pageData.length;

                                return (
                                    <>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell colSpan="2">Average Hours</Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <Text>{averageHours}</Text>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell colSpan="2">Total Hours</Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <Text>{totalHours}</Text>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </>
                                );
                            }}
                        />
                    </div>
                </div>
                :
                <></>
            }
        </>
    );

};

export default StaffHours;