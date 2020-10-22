import './Department.scss';
import DepartmentService from '../../services/department.service';
import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';

class Department extends Component {
    constructor(props) {
        super(props);
        this.state = { name: '' }
        this.onNameChange = this.onNameChange.bind(this);
        this.onInsertClick = this.onInsertClick.bind(this);
    }

    onNameChange(e) {
        this.setState({ name: e.target.value });
    }

    onInsertClick(e) {
        let newDepartment = {
            'name': this.state.name
        };

        DepartmentService.create(newDepartment);
    }

    render() {
        return (
            <>
                <h1>Create a new Department</h1>
                <Form name="control-hooks" onFinish={this.onInsertClick}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input
                            name="name"
                            onChange={this.onNameChange}
                            placeholder="Department Name"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create
                    </Button>
                    </Form.Item>
                </Form>
            </>
        );
    }
}

export default Department;