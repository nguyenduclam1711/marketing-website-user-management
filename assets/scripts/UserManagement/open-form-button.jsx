import { Button, Form, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import UserForm from './form.jsx';

const OpenFormButton = ({ children, buttonProps = {}, userData = {}, onGotSuccess }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const { _id, username } = userData || {};

  const title = _id ? `Update user ${username}` : 'Create user';

  const onToggleVisible = () => {
    setVisible(!visible);
  }

  const onFormGotSuccess = () => {
    onToggleVisible();
    if (onGotSuccess) onGotSuccess();
  }

  const onCancel = () => {
    setVisible(false);
  };

  const onOk = () => form.submit();

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);

  return (
    <>
      <Button {...{
        ...buttonProps,
        onClick: onToggleVisible,
      }}>
        {children}
      </Button>
      <Modal {...{
        open: visible,
        title,
        destroyOnClose: true,
        onCancel,
        onOk,
      }}>
        <UserForm {...{
          userData,
          onGotSuccess: onFormGotSuccess,
          form,
        }} />
      </Modal>
    </>
  )
}

export default OpenFormButton;
