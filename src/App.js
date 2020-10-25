import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {Layout, Menu, Breadcrumb} from 'antd';
import 'antd/dist/antd.css';
import './App.css';

import AuthService from "./services/auth.service";

import Login from "./components/Login/Login";
import Signup from "./components/Singup/Signup";
import Home from "./components/Home/Home";

import Department from "./components/Department/Department";
import Role from "./components/Role/Role";
// import Priority from "./components/Priority";

function App() {

    const {Header, Content, Footer} = Layout;
    const [currentUser, setCurrentUser] = useState(undefined);
    const [pageSelected, setPageSelected] = useState(["1"]);
    // const [breadCrumb, setBreadCrumb] = useState("Login");

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        console.log(user);

        if (user) {
            setCurrentUser(user);
        }

    }, []);

    const logOut = () => {
        AuthService.logout();
    };

    return (
        <Router>
            <Layout className="layout" style={{height:"100vh"}} >
                <Header>
                    <div className="logo"/>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={pageSelected}>
                        
                        {!currentUser ? (
                            <Menu.Item key="1">
                                <Link to={"/login"}>
                                    Login
                                </Link>
                            </Menu.Item>
                        ): null}
                        {!currentUser ? (
                            <Menu.Item key="2">
                                <Link to={"/signup"}>
                                    Sign up
                                </Link>
                            </Menu.Item>
                        ): null}


                        {/*  */}
                        {currentUser ? (
                            <Menu.Item key="1">
                                <Link to={"/home"}>
                                    Home
                                </Link>
                            </Menu.Item>
                        ): null}
                        {currentUser ? (
                            <Menu.Item key="2">
                                <Link to={"/departments"}>
                                    Department
                                </Link>
                            </Menu.Item>
                        ): null}
                        {currentUser ? (
                            <Menu.Item key="3">
                                <a href="/login" className="nav-link" onClick={logOut}>
                                    LogOut
                                </a>
                            </Menu.Item>
                        ): null}

                    </Menu>

                </Header>
                <Content style={{padding: '10px 20px'}}>
                    <Breadcrumb style={{margin: '0px 0px 10px 0px'}}>
                        <Breadcrumb.Item></Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-content">
                        <Switch>
                            <Route exact path={["/", "/login"]} component={Login}/>
                            <Route exact path="/login" component={Login}/>
                            <Route exact path="/signup" component={Signup}/>
                            <Route exact path="/home" component={Home}/>
                            <Route exact path="/departments" component={Department}/>
                            {/* <Route exact path="/roles" component={Role}/> */}
                            {/* <Route exact path="/priority" component={Priority}/> */}
                        </Switch>
                    </div>
                </Content>

                <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>

            </Layout>

            
        </Router>
    );
}

export default App;