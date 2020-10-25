
import './Login.scss';

import React, {useState} from "react";
import {Form, Input, Button, Alert} from 'antd';
import {EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined} from '@ant-design/icons';

import AuthService from "../../services/auth.service";

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
        offset: 2,
        span: 6,
    },
};

const Login = (props) => {
    const [form] = Form.useForm();
    const [login, setLogin] = useState({});
    const [error, setError] = useState(false);

    /**
     * React Hooks
     * https://reactjs.org/docs/hooks-reference.html
     */

    /** Service methods **/
    const loginMethod = () => {
        AuthService.login(login)
            .then(response => {

                console.log(login);
                setLogin(response.data);
                form.resetFields();

                props.history.push("/home");
                window.location.reload();

                // props.history.push("/priority");
                // props.history.push("/roles");
                // window.location.reload();
            })
            .catch(err => {
                setError(true);
                console.error(err);
            });
    }

    /** Handle actions in the Form **/
    const handleInputChange = event => {
        let {name, value} = event.target;
        setLogin({...login, [name]: value});
    };

    /** General Methods **/
    const onFinish = data => {
        console.log(login);
        loginMethod();
    };

    const onReset = () => {
        form.resetFields();
    };

    const toSignUp = () => {
        props.history.push("/signup");
        window.location.reload();
    }

    return (
        <div>

            {/* form */}
            <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
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

                {/* button */}
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" style={{marginRight: "10px"}}>
                        Login
                    </Button>
                    {/* <Button htmlType="button" onClick={toSignUp}>
                        Sign up
                    </Button> */}
                </Form.Item>
            </Form>
            {error ? (
                <Alert message="Error in the system. Try again later." type="error" showIcon closable/>
            ) : null}
        </div>
    )
};

export default Login;