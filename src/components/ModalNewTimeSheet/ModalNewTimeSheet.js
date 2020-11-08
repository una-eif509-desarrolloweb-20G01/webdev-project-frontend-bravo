import React, { useState } from 'react';
import { Button, Modal, Form, Input, Descriptions, InputNumber } from 'antd';

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

const initialTimeSheet = {
    name: ""
};

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

const ModalNewTimeSheet = ({ visible, onCreate, onCancel }) => {

    const [form] = Form.useForm();
    const [timeSheet, setTimeSheet] = useState(initialTimeSheet);
    const [details, setDetails] = useState(initialDetails);
    const [totalHours, setTotalHours] = useState(0);

    /** General Methods **/
    const validate = () => {

        form
            .validateFields()
            .then((values) => {
                console.log(timeSheet);
                console.log(details);
                setTotalHours(0);
                onCreate(timeSheet, details, values);
                onReset();
            })
            .catch((err) => {
                console.error('Validate Failed:', err);
            });
    };
    
    /** Handle actions in the Form **/
    const handleInputChange = event => {
        let {name, value} = event.target;
        setTimeSheet({...timeSheet, [name]: value});
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
        // setUser(initialUserState);
        form.resetFields();
    };

    return (
        <Modal
            visible={visible}
            title="New TimeSheet"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            okButtonProps={{ style: { display: 'none' } }}
        >
            <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                <Form.Item
                    name="name"
                    label="TimeSheet"
                    rules={required}
                >
                    <Input
                        name="name"
                        onChange={handleInputChange}
                        placeholder="Name"
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
                        Create TimeSheet
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalNewTimeSheet;
