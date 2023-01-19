import { Form, notification } from 'antd';
import React from 'react';
import { userFormSchema } from './constants.jsx';
import { handleCreateUser, handleUpdateUser } from './helpers.js';

const UserForm = ({ userData = {}, onGotSuccess, form }) => {
  const { _id, admin, superAdmin } = userData || {};
  const isUpdate = !!_id;

  const onCallApiGotSuccess = (response) => {
    console.log('response', response);
    notification.success({
      message: isUpdate ? 'Update user successfully' : 'Create user successfully',
    });
    if (onGotSuccess) onGotSuccess(response);
  }

  const onFinish = values => {
    if (isUpdate) {
      handleUpdateUser({
        userId: _id,
        values,
        onGotSuccess: onCallApiGotSuccess
      });
      return;
    }
    handleCreateUser({
      values,
      onGotSuccess: onCallApiGotSuccess
    });
  }

  return (
    <Form {...{
      onFinish,
      initialValues: {
        ...userData,
        password: '',
        admin: admin === 'true',
        superAdmin: superAdmin === 'true',
      },
      form,
    }}>
      {userFormSchema.map((schemaItem, index) => {
        const { children, ...rest } = schemaItem;

        return (
          <Form.Item key={`user-form-item-${index}`} {...rest}>
            {children}
          </Form.Item>
        )
      })}
    </Form>
  )
}

export default UserForm;
