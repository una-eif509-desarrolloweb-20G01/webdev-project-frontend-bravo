import './Summary.scss';
import React, { useState, useEffect } from 'react';
import { Table, Button, Select, Form, Typography, Row, Col } from 'antd';
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

const Summary = () => {
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

        if (timeSheet && timeSheet.details && timeSheet.details.length > 0) {
            let user = users.get(timeSheet.details[0].employeeId);

            let weeklyHoursPerManager = timeSheet.details.map(detail => {
                let user = users.get(detail.approvingManagerId);

                let totalHoursWeek = detail.hoursMonday +
                    detail.hoursTuesday +
                    detail.hoursWednesday +
                    detail.hoursThursday +
                    detail.hoursFriday +
                    detail.hoursSaturday +
                    detail.hoursSunday;

                return {
                    managerId: user.id,
                    manager: user.firstName + ' ' + user.lastName,
                    hoursForWeek: totalHoursWeek,
                    hoursPaid: detail.paid ? totalHoursWeek : 0,
                    hoursUnpaid: detail.paid ? 0 : totalHoursWeek,
                    hoursApproved: detail.approved ? totalHoursWeek : 0,
                    hoursDisapproved: detail.approved ? 0 : totalHoursWeek
                }
            });

            let hours = new Map();

            for (let i = 0; i < weeklyHoursPerManager.length; i++) {
                if (!hours.has(weeklyHoursPerManager[i].managerId)) {
                    let hrs = {
                        managerId: weeklyHoursPerManager[i].managerId,
                        manager: weeklyHoursPerManager[i].manager,
                        hoursForWeek: weeklyHoursPerManager[i].hoursForWeek,
                        hoursPaid: weeklyHoursPerManager[i].hoursPaid,
                        hoursUnpaid: weeklyHoursPerManager[i].hoursUnpaid,
                        hoursApproved: weeklyHoursPerManager[i].hoursApproved,
                        hoursDisapproved: weeklyHoursPerManager[i].hoursDisapproved
                    };
                    hours.set(weeklyHoursPerManager[i].managerId, hrs);
                } else {
                    let hrs = hours.get(weeklyHoursPerManager[i].managerId);
                    hrs.hoursForWeek = hrs.hoursForWeek + weeklyHoursPerManager[i].hoursForWeek;
                    hrs.hoursPaid = hrs.hoursPaid + weeklyHoursPerManager[i].hoursPaid;
                    hrs.hoursUnpaid = hrs.hoursUnpaid + weeklyHoursPerManager[i].hoursUnpaid;
                    hrs.hoursApproved = hrs.hoursApproved + weeklyHoursPerManager[i].hoursApproved;
                    hrs.hoursDisapproved = hrs.hoursDisapproved + weeklyHoursPerManager[i].hoursDisapproved;
                    hours.set(weeklyHoursPerManager[i].managerId, hrs);
                }
            }

            let newReport = {
                id: generateReportId(),
                department: user.department ? user.department.name : '',
                name: timeSheet.name,
                columns: [
                    {
                        title: 'Manager',
                        dataIndex: 'manager',
                        key: 'manager',
                    },
                    {
                        title: 'Hours for Week',
                        dataIndex: 'hoursForWeek',
                        key: 'hoursForWeek',
                    },
                    {
                        title: 'Hours Paid',
                        dataIndex: 'hoursPaid',
                        key: 'hoursPaid',
                    },
                    {
                        title: 'Hours Unpaid',
                        dataIndex: 'hoursUnpaid',
                        key: 'hoursUnpaid',
                    },
                    {
                        title: 'Hours Approved',
                        dataIndex: 'hoursApproved',
                        key: 'hoursApproved',
                    },
                    {
                        title: 'Hours Disapproved',
                        dataIndex: 'hoursDisapproved',
                        key: 'hoursDisapproved',
                    },
                ],
                data: Array.from(hours, ([name, value]) => (value))
            };

            setReport(newReport);
        }
    };

    return (
        <>
            <h1>Summary Hours Report</h1>
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
                <>
                    <Row>
                        <Col span={6}></Col>
                        <Col span={12}>
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
                        </Col>
                        <Col span={6}></Col>
                    </Row>
                    <Row>
                        <Col span={6}></Col>
                        <Col span={12}>
                            <Table
                                dataSource={report.data}
                                columns={report.columns}
                                pagination={false}
                                bordered
                                summary={pageData => {
                                    let totalHours = 0;

                                    pageData.forEach(({ hoursForWeek }) => {
                                        totalHours += hoursForWeek;
                                    });

                                    let averageHours = totalHours / pageData.length;

                                    return (
                                        <>
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell colSpan={5}>Average Hours</Table.Summary.Cell>
                                                <Table.Summary.Cell>
                                                    <Text>{averageHours}</Text>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell colSpan={5}>Total Hours</Table.Summary.Cell>
                                                <Table.Summary.Cell>
                                                    <Text>{totalHours}</Text>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        </>
                                    );
                                }}
                            />
                        </Col>
                        <Col span={6}></Col>
                    </Row>
                    <Row>
                        <Col span={6}></Col>
                        <Col span={12}>
                            <div class="report-buttons">
                                <Button id="printButton" type="primary" onClick={(event) => { window.print(); }}>
                                    Print
                                </Button>
                                <Button id="cancelButton" type="primary" onClick={(event) => { setReport(null); }}>
                                    Cancel
                                </Button>
                            </div>
                        </Col>
                        <Col span={6}></Col>
                    </Row>
                </>
                :
                <></>
            }
        </>
    );

};

export default Summary;