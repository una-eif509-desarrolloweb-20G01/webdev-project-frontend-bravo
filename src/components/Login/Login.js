
import './Login.scss';

import React, {useState} from "react";
import {PageHeader, Form, Input, Button, Alert} from 'antd';
import {EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined} from '@ant-design/icons';

import AuthService from "../../services/auth.service";
import userService from "../../services/user.service";

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
            .then(res => {

                userService.findUserByUserName(login.username).then(res_user =>{
                
                    console.log(res_user);
    
                    localStorage.setItem("user.data",  JSON.stringify({ data: res_user.data }));
    
                    props.history.push("/home");
                    window.location.reload();
                });
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

    return (
        <>
            <PageHeader
                className="site-page-header"
                title="Login"
            />
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
                </Form.Item>
            </Form>
            {error ? (
                <Alert message="Error in the system. Try again later." type="error" showIcon closable/>
            ) : null}
        </>
    )
};

export default Login;