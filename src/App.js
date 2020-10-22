import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {Layout, Menu, Breadcrumb} from 'antd';
import 'antd/dist/antd.css';
import './App.css';

import AuthService from "./services/auth.service";
import Login from "./components/Login";
import Home from "./components/Home";
import Role from "./components/Role";
import Department from "./components/Department/Department";
// import Priority from "./components/Priority";
// import Signup from "./components/Signup";

function App() {
    const {Header, Content, Footer} = Layout;
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const logOut = () => {
        AuthService.logout();
    };

    return (
        <Router>
            <Layout className="layout">
                <Header>
                    <div className="logo"/>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">
                            <Link to={"/login"}>
                                Login
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to={"/signup"}>
                                Sign up
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to={"/role"}>
                                Role
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to={"/departments"}>
                                Department
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <a className="nav-link" onClick={logOut}>
                                LogOut
                            </a>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content style={{padding: '0 50px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-content">
                        <Switch>
                            <Route exact path={["/", "/home"]} component={Home}/>
                            <Route exact path="/login" component={Login}/>
                            <Route exact path="/role" component={Role}/>
                            <Route exact path="/departments" component={Department}/>
                            {/* <Route exact path="/priority" component={Priority}/> */}
                            {/* <Route exact path="/signup" component={Signup}/> */}
                        </Switch>
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </Router>
    );
}

export default App;