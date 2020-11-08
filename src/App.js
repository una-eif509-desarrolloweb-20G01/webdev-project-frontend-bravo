import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import {Layout, Menu, Breadcrumb} from 'antd';
import {
    HomeOutlined,
    UserAddOutlined,
    LoginOutlined,
    LogoutOutlined,
    FileDoneOutlined,
    TeamOutlined,
    UserOutlined,
    CheckOutlined,
    PlusOutlined,
    ClockCircleOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import './App.css';

import AuthService from "./services/auth.service";

import Login from "./components/Login/Login";
import Signup from "./components/Singup/Signup";
import Home from "./components/Home/Home";

import TimeSheetsTable from "./components/TimeSheetsTable/TimeSheetsTable";
import ApproveTimeSheet from "./components/ApproveTimeSheet/ApproveTimeSheet";

import DepartmentEditableTable from "./components/DepartmentEditableTable/DepartmentEditableTable";

import StaffHours from "./components/Reports/StaffHours/StaffHours";
import Summary from "./components/Reports/Summary/Summary";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Unauthorized from "./components/Unauthorized/Unauthorized";

function App() {

    const SubMenu = Menu.SubMenu;

    const {Header, Content, Footer} = Layout;
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentPage, setCurrentPage] = useState("Login");
    const [userLogged, setLogged] = useState(false);
    const [userInfo, setUserInfo] = useState({
        data: {
            firstName: ""
        }
    });
    
    useEffect(() => {
        const user = AuthService.getCurrentUser();
        const userData = AuthService.getCurrentUserData();

        console.log(user);

        if (user) {
            setCurrentUser(user);
            setLogged(true);
            setUserInfo(userData);
        }

    }, []);

    const logOut = () => {
        AuthService.logout();
        setCurrentUser(undefined);
        setCurrentPage("Login");
    };
    const handleClick = e => {
        setCurrentPage(e.key);
    };

    return (
        
        <Router>
            <Layout className="layout" style={{height:"100vh"}} >
                <Header style={{paddingRight:"20px"}}>
                    <div className="logo"/>

                    <Menu theme="dark" mode="horizontal" onClick={handleClick} selectedKeys={[currentPage]} style={{ float: "right" }}>    
                        
                        {!userLogged ? 
                            <>
                            <Menu.Item key="Login" icon={<LoginOutlined />}>
                                <Link to={"/login"}>
                                    Login
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="Signup" icon={<UserAddOutlined />}>
                                <Link to={"/signup"}>
                                    Sign up
                                </Link>
                            </Menu.Item>
                            </>
                        : null}

                        {/* */}
                        {userLogged ? 
                            <>
                            <Menu.Item key="Home" icon={<HomeOutlined />}>
                                <Link to={"/home"}>
                                    Home
                                </Link>
                            </Menu.Item>
                            
                            <SubMenu icon={<FileDoneOutlined />} title="Timesheets">
                                
                                {userInfo.data.role.name === 'ROLE_ADMIN' ?
                                    <Menu.Item key="ApproveTimeSheet" icon={<CheckOutlined />}>
                                        <Link to={"/approve-timesheets"}>
                                            Approve
                                        </Link>
                                    </Menu.Item>
                                    :
                                    <Menu.Item key="Timesheet" icon={<PlusOutlined />}>
                                        <Link to={"/timesheets"}>
                                            New
                                        </Link>
                                    </Menu.Item>
                                }
                                
                            </SubMenu>

                            <Menu.Item key="Department" icon={<TeamOutlined />}>
                                <Link to={"/departments"}>
                                    Departments
                                </Link>
                            </Menu.Item>

                            {userInfo.data.role.name === 'ROLE_ADMIN' ?
                                <SubMenu className="sub-menu-reports" icon={<FileDoneOutlined />} title="Reports">
                                    <Menu.Item key="Staff Hours" icon={<ClockCircleOutlined />}>
                                        <Link to={"/reports/staff-hours"}>
                                            Staff Hours
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="Summary" icon={<UnorderedListOutlined />}>
                                        <Link to={"/reports/summary"}>
                                            Summary
                                        </Link>
                                    </Menu.Item>
                                </SubMenu> 
                                :
                                <></>
                            }

                            <SubMenu className="sub-menu-user" icon={<UserOutlined />} title={userInfo.data.firstName}>
                                <Menu.Item icon={<LogoutOutlined />}>
                                    <a href="/login" className="nav-link" onClick={logOut}>
                                        LogOut
                                    </a>
                                </Menu.Item>
                            </SubMenu>
                            </>
                        : null}
                    </Menu>

                </Header>

                <Content style={{padding: '10px 20px'}}>
                    <Breadcrumb style={{margin: '0px 0px 10px 0px'}}>
                        <Breadcrumb.Item></Breadcrumb.Item>
                    </Breadcrumb>

                    <div className="site-layout-content">
                        <Switch>
                            <Route exact path={['/', '/login']} component={Login} />
                            <Route exact path='/signup' component={Signup}/>

                            {/* <ProtectedRoute exact path='/home' user={currentUser} component={Home}/>
                            <ProtectedRoute exact path='/departments' user={currentUser} component={DepartmentEditableTable} />
                            <ProtectedRoute exact path='/timesheets' user={currentUser} component={TimeSheetsTable} /> */}

                            <Route exact path='/home' component={Home}/>
                            <Route exact path='/departments' user={currentUser} component={DepartmentEditableTable} />
                            <Route exact path='/timesheets' user={currentUser} component={TimeSheetsTable} />
                            
                            <Route exact path='/approve-timesheets' user={currentUser} component={ApproveTimeSheet} />
                            <Route exact path='/reports/staff-hours' component={StaffHours}/>
                            <Route exact path='/reports/summary' component={Summary}/>

                            <Route exact path='/unauthorized' component={Unauthorized} />
                        </Switch>
                    </div>
                </Content>

                <Footer style={{textAlign: 'center'}}>Ant Design ©2020 Created by Bravo</Footer>
            </Layout>

        </Router>
    );
}

export default App;