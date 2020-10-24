import './DepartmentEditableTable.scss';
import React, { useState, useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';
import DepartmentService from '../../services/department.service';

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                    children
                )}
        </td>
    );
};

const DepartmentEditableTable = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');

    useEffect(() => {
        DepartmentService.getAll().then(response => {
            const originData = [];

            for (let i = 0; i < response.data.length; i++) {
                originData.push({
                    key: i.toString(),
                    id: response.data[i].id.toString(),
                    name: response.data[i].name.toString(),
                    new: 'false'
                });
            }

            setData(originData);
        });
    }, []);

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            id: '',
            name: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const remove = (record) => {
        DepartmentService.remove(record.id).then(response => {
            if (response.status === 200) {
                const dataSource = [...data];
                setData(dataSource.filter(item => item.key !== record.key));
            }
        });
    };

    const add = () => {
        let newKey = 0;

        if (data.length > 0) {
            newKey = parseInt(data[data.length - 1].key) + 1;
        }

        let newRecord = {
            key: newKey.toString(),
            id: '',
            name: '',
            new: 'true'
        };

        const dataSource = [...data];
        dataSource.push(newRecord);
        setData(dataSource);

        form.setFieldsValue({
            id: '',
            name: '',
            ...newRecord,
        });
        setEditingKey(newRecord.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];

                if (item.new === 'true') {
                    DepartmentService.create({
                        name: row.name
                    }).then(response => {
                        if (response.status === 200) {
                            row.id = response.data.id;
                            item.new = 'false';

                            newData.splice(index, 1, { ...item, ...row });
                            setData(newData);
                            setEditingKey('');
                        }
                    });
                } else {
                    DepartmentService.update(item.id, 
                        {
                            id: parseInt(item.id),
                            name: row.name
                        }
                    ).then(response => {
                        if (response.status === 200) {
                            newData.splice(index, 1, { ...item, ...row });
                            setData(newData);
                            setEditingKey('');
                        }
                    });
                }
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            width: '25%',
            editable: false,
        },
        {
            title: 'name',
            dataIndex: 'name',
            width: '25%',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <a
                            href="javascript:;"
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
            </a>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                        <span>
                            <a disabled={editingKey !== ''} onClick={() => edit(record)}>
                                Edit
                        </a>
                        &nbsp;
                        &nbsp;
                            <Popconfirm title="Sure to delete?" onConfirm={() => remove(record)}>
                                <a>Delete</a>
                            </Popconfirm>
                        </span>
                    );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <>
            <Button onClick={add} type="primary" style={{ marginBottom: 16 }}>
                Add a row
            </Button>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                    }}
                />
            </Form>
        </>
    );
};

export default DepartmentEditableTable;