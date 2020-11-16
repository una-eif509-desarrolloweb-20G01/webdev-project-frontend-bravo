import React, {useState, useEffect} from "react";
import {PageHeader, Form, Alert, Input, Button, Select} from "antd";
import {EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined, MailOutlined} from "@ant-design/icons";

import DepartmentService from '../../services/department.service';
import UserService from "../../services/user.service";

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

const initialUserState = {
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    enabled: true,
    department: {
        id: null,
        name: ""
    },
    role: {
        id: 2,
        name: "ROLE_USER"
    }
};

const Signup = (props) => {
    const [form] = Form.useForm();
    const [user, setUser] = useState(initialUserState);
    const [error, setError] = useState(false);
    const [options, setOptions] = useState([]);

    useEffect(() => {

        DepartmentService.getAll().then(res => {
            
            const data = [];

            res.data.forEach((department, index ) => {
                data.push({
                    value: department.id,
                    label: department.name
                });
            });

            setOptions(data);
        });
    }, []);

    /**
     * React Hooks
     * https://reactjs.org/docs/hooks-reference.html
     */

    /** Service methods **/
    const signUpMethod = () => {
        UserService.signup(user)
            .then(res => {
                console.log(res);
                setUser(res.data);
                form.resetFields();
                setError(false);
            })
            .catch(err => {
                console.log(err);
                setError(err);
            });
    }

    /** Handle actions in the Form **/
    const handleInputChange = event => {
        let {name, value} = event.target;
        setUser({...user, [name]: value});
    };
    const handleChange = (option) => {
        setUser({...user, department: {
                id: option.value,
                name: option.label
            }
        });
    };

    /** General Methods **/
    const onFinish = data => {
        console.log(user);
        signUpMethod();
    };
    const onReset = () => {
        setUser(initialUserState);
        form.resetFields();
    };

    return (
        <>
            <PageHeader
                className="site-page-header"
                title="Sign Up"
            />
            <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input
                        name="firstName"
                        prefix={<UserOutlined className="site-form-item-icon"/>}
                        onChange={handleInputChange}
                        placeholder="First Name"
                    />
                </Form.Item>
                {/*  */}

                <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input
                        name="lastName"
                        prefix={<UserOutlined className="site-form-item-icon"/>}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                    />
                </Form.Item>
                {/*  */}

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input
                        name="email"
                        prefix={<MailOutlined className="site-form-item-icon"/>}
                        onChange={handleInputChange}
                        placeholder="Email"
                    />
                </Form.Item>
                {/*  */}

                <Form.Item
                    name="department"
                    label="Department"
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
                        name="department"
                        onChange={handleChange}
                        options={options}
                        placeholder="Select a department"
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    />
                </Form.Item>
                {/*  */}

                <Form.Item
                    name="username"
                    label="User Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input
                        name="username"
                        prefix={<UserOutlined className="site-form-item-icon"/>}
                        onChange={handleInputChange}
                        placeholder="User Name"
                    />
                </Form.Item>
                {/*  */}

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input.Password
                        name="password"
                        prefix={<LockOutlined className="site-form-item-icon"/>}
                        onChange={handleInputChange}
                        placeholder="Password"
                        iconRender={visible => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                    />
                </Form.Item>
                {/*  */}

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" style={{ marginRight: "10px"}}>
                        Submit
                    </Button>
                    <Button htmlType="button" onClick={onReset}>
                        Reset
                    </Button>
                </Form.Item>
            </Form>
            {user.id ? (
                <Alert message="User saved" type="success" showIcon closable />
            ) : null}
            {error ? (
                <Alert message="Error in the system. Try again later." type="error" showIcon closable/>
            ) : null}
        </>
    )
};

export default Signup;