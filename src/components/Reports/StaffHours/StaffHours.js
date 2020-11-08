import './StaffHours.scss';
import React, { useState, useEffect } from 'react';
import { Table, Button, Select, Form } from 'antd';
import TimeSheetService from '../../../services/timesheet.service';

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
    const [timeSheetSelectOptions, setTimeSheetSelectOptions] = useState([]);

    useEffect(() => {
        TimeSheetService.getAll().then(response => {
            const data = [];

            response.data.forEach((timeSheet, index) => {
                data.push({
                    value: timeSheet.id,
                    label: timeSheet.name
                });
            });

            setTimeSheetSelectOptions(data);
        });
    }, []);

    const onFinish = data => {
        
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
        </>
    );

};

export default StaffHours;