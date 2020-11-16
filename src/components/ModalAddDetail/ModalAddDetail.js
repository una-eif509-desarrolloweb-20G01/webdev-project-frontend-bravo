import React, { useState } from 'react';
import { Button, Modal, Form, Descriptions, InputNumber, Select } from 'antd';

const layout = {
    labelCol: {
        offset: 0,
        span: 5,
    },
    wrapperCol: {
        offset: 1,
        span: 11,
    },
};

const tailLayout = {
    wrapperCol: {
        offset: 0,
        span: 6,
    },
};

const approvingManagerId = null;

const initialDetails = {
    hoursMonday: 0,
    hoursTuesday: 0,
    hoursWednesday: 0,
    hoursThursday: 0,
    hoursFriday: 0,
    hoursSaturday: 0,
    hoursSunday: 0,
    paid: false,
    approved: false
}

const required = [
    {
        required: true,
    }
]

const ModalAddDetail = ({ visible, onAddDetail, onCancel, managerList }) => {

    const [form] = Form.useForm();
    const [details, setDetails] = useState(initialDetails);
    const [totalHours, setTotalHours] = useState(0);
    const [manager, setManager] = useState(approvingManagerId);

    /** General Methods **/
    const validate = () => {

        form
            .validateFields()
            .then((values) => {
                console.log(details);
                setTotalHours(0);
                onAddDetail(manager, details, values);
                onReset();
            })
            .catch((err) => {
                console.error('Validate Failed:', err);
            });
    };
    const handleChange = (option) => {
        setManager(option.value);
    };
    const onChange = e => {

        const value = e.target.value;
        console.log(value);
        if(value !== ""){
            let {name, value} = e.target;
            setDetails({...details, [name]: parseInt(value)});
            setTotalHours(totalHours + parseInt(value));
        }
    };
    const onChangeFocus = e => {
        const value = e.target.value;
        if(value !== ""){
            setTotalHours(totalHours - parseInt(value));
        }
    };
    const onFinish = data => {
        validate();
    };
    const onReset = () => {
        form.resetFields();
    };

    return (
        <Modal
            visible={visible}
            title="Add Detail"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            okButtonProps={{ style: { display: 'none' } }}
        >
            <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>

                <Form.Item
                    name="approvingManagerId"
                    label="Manager"
                    rules={required}
                >

                    <Select
                        showSearch
                        labelInValue
                        optionFilterProp="label"
                        name="approvingManagerId"
                        onChange={handleChange}
                        options={managerList}
                        placeholder="Select a manager"
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    />
                </Form.Item>

                <Form.Item
                        name="hoursMonday"
                        label="Monday"
                        rules={required}
                        >

                    <InputNumber
                        name="hoursMonday"
                        min={0}
                        max={10}
                        onBlur={onChange}
                        onFocus={onChangeFocus}
                        placeholder="hours"
                    />
                </Form.Item>

                <Form.Item
                        rules={required}
                        name="hoursTuesday"
                        label="Tuesday">

                    <InputNumber
                        name="hoursTuesday"
                        min={0}
                        max={10}
                        onBlur={onChange}
                        placeholder="hours"
                        onFocus={onChangeFocus}
                    />
                </Form.Item>

                <Form.Item
                        rules={required}
                        name="hoursWednesday"
                        label="Wednesday">

                    <InputNumber
                        name="hoursWednesday"
                        min={0}
                        max={10}
                        onBlur={onChange}
                        onFocus={onChangeFocus}
                        placeholder="hours"
                    />
                </Form.Item>

                <Form.Item
                    rules={required}
                        name="hoursThursday"
                        label="Thursday">

                    <InputNumber
                        name="hoursThursday"
                        min={0}
                        max={10}
                        onBlur={onChange}
                        onFocus={onChangeFocus}
                        placeholder="hours"
                    />
                </Form.Item>

                <Form.Item
                    rules={required}
                        name="hoursFriday"
                        label="Friday">

                    <InputNumber
                        name="hoursFriday"
                        min={0}
                        max={10}
                        onBlur={onChange}
                        onFocus={onChangeFocus}
                        placeholder="hours"
                    />
                </Form.Item>

                <Form.Item
                    rules={required}
                        name="hoursSaturday"
                        label="Saturday">

                    <InputNumber
                        name="hoursSaturday"
                        min={0}
                        max={10}
                        onBlur={onChange}
                        onFocus={onChangeFocus}
                        placeholder="hours"
                    />
                </Form.Item>

                <Form.Item
                    rules={required}
                        name="hoursSunday"
                        label="Sunday">

                    <InputNumber
                        name="hoursSunday"
                        min={0}
                        max={10}
                        onBlur={onChange}
                        onFocus={onChangeFocus}
                        placeholder="hours"
                    />
                </Form.Item>

                {/*  */}
                <Descriptions>
                    <Descriptions.Item label="Total hours">{totalHours}</Descriptions.Item>
                </Descriptions>

                {/*  */}

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Add Hours
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalAddDetail;
