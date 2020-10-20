import React, {useState, useEffect} from "react";
import {Alert, Table} from 'antd';

import RoleService from "../services/role.service";

const initialRoleListState = [
    {
        "id": 0,
        "name": ""
    }
];

const Role = (props) => {
    const [roleList, setRoleList] = useState(initialRoleListState);
    const [error, setError] = useState(false);

    /**
     * React Hooks
     * https://reactjs.org/docs/hooks-reference.html
     */

    useEffect(() => {
        getAllRolesMethod();
    },);

    /** Service methods **/
    const getAllRolesMethod = () => {
        RoleService.getAll()
            .then(response => {
                // console.log(response);
                console.log(response.data);
                // setRoleList(response.data);
            })
            .catch(err => {
                console.error(err);
                setError(err);
                if (err.response.status === 401) {
                    props.history.push("/login");
                    window.location.reload();
                }
            });
    }

    /** Handle actions in the Form **/

    /** General Methods **/
    const columns = [
        {
            title: 'Roles',
            render: (role) => role.name
        }
    ];

    return (
        <div>
            {/* <Table rowKey={role => roleList.id} columns={columns} dataSource={roleList}/>
            {error ? (
                <Alert message="Error in the system. Try again later." type="error" showIcon closable/>
            ) : null} */}

            {/* <Table dataSource={roleList} columns={columns} /> */}
        </div>
    )
};

export default Role;