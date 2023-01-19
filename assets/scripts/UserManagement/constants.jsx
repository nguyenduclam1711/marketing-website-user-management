import { Button, Input, Switch, Tag } from 'antd';
import React from 'react';
import moment from 'moment';
import OpenFormButton from './open-form-button.jsx';
import { EditOutlined } from '@ant-design/icons';
import DeleteUserButton from './delete-user-button.jsx';

export const getPermissionsRenderConfig = ({ admin, superAdmin }) => {
  const result = [];

  if (superAdmin !== 'false') {
    result.push({
      label: 'Super admin',
      color: 'green',
    })
  }
  if (admin !== 'false') {
    result.push({
      label: 'Admin',
      color: 'blue',
    })
  }
  return result;
}

export const formatDate = date => date ? moment(date).format('DD/MM/YYYY, HH:mm:ss') : ''

export const userManagementTableColumns = ({ refetchUsers }) => [
  {
    title: 'Username',
    dataIndex: 'username',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Permissions',
    render: document => {
      const { admin, superAdmin, _id } = document;
      const config = getPermissionsRenderConfig({ admin, superAdmin });
      return (
        <div>
          {config.map((item, index) => (
            <Tag key={`permission-${_id}-${index}`} {...{
              color: item.color
            }}>
              {item.label}
            </Tag>
          ))}
        </div>
      )
    }
  },
  {
    title: 'Activated at',
    dataIndex: 'activatedAt',
    render: formatDate,
  },
  {
    title: 'Verified at',
    dataIndex: 'verifiedAt',
    render: formatDate,
  },
  {
    title: 'Action',
    render: userData => {
      return (
        <Button.Group>
          <OpenFormButton {...{
            buttonProps: {
              icon: (
                <EditOutlined />
              )
            },
            userData,
            onGotSuccess: () => {
              refetchUsers();
            },
          }} />
          <DeleteUserButton {...{
            userData,
            onGotSuccess: () => {
              refetchUsers();
            },
          }} />
        </Button.Group>
      )
    },
  },
]

export const userFormSchema = [
  {
    label: 'Username',
    name: 'username',
    rules: [
      {
        required: true,
        message: 'Username is required'
      }
    ],
    children: (
      <Input {...{
        placeholder: 'Enter the username'
      }} />
    )
  },
  {
    label: 'Email',
    name: 'email',
    rules: [
      {
        required: true,
        message: 'Email is required'
      },
      {
        type: 'email',
        message: 'Invalid email address'
      },
    ],
    children: (
      <Input {...{
        placeholder: 'Enter the email'
      }} />
    )
  },
  {
    label: 'Password',
    name: 'password',
    children: (
      <Input.Password {...{
        placeholder: 'Enter the password'
      }} />
    )
  },
  {
    label: 'Is admin',
    name: 'admin',
    valuePropName: 'checked',
    children: (
      <Switch />
    )
  },
  {
    label: 'Is superadmin',
    name: 'superAdmin',
    valuePropName: 'checked',
    children: (
      <Switch />
    )
  },
]
