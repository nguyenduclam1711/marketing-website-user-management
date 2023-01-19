import { DeleteFilled } from '@ant-design/icons';
import { Button, Modal, notification } from 'antd';
import React from 'react';
import { handleDeleteUser } from './helpers';

const DeleteUserButton = ({ userData, onGotSuccess }) => {
  const { username, _id } = userData;

  const onClick = () => {
    Modal.confirm({
      title: `Are you sure you want to delete user ${username}?`,
      onOk: async () => {
        await handleDeleteUser({
          userId: _id,
          onGotSuccess: () => {
            notification.success({
              message: 'Delete successfully',
            });
            if (onGotSuccess) onGotSuccess();
          }
        })
      }
    })
  }

  return (
    <Button {...{
      onClick,
      icon: (
        <DeleteFilled {...{
          style: {
            color: 'red'
          }
        }} />
      )
    }} />
  )
}

export default DeleteUserButton;
