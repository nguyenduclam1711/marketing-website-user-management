import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';
import { Table } from 'antd';
import { handleFetchUsers } from './helpers';
import { userManagementTableColumns } from './constants.jsx';
import OpenFormButton from './open-form-button.jsx';

const UserManagementWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  min-height: 600px;
  margin: 0 auto;

  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .title {
    font-size: 32px;
    font-weight: bold;
  }
`

const UserManagement = () => {
  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 20,
    total: 0,
  });
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSetPagination = newPagination => {
    setPagination({
      ...pagination,
      ...newPagination,
    })
  }

  const onHandleFetchSuccess = response => {
    const { data, total } = response;

    handleSetPagination({
      total,
    });
    setDataSource(data);
  }

  const onHandleFetchUsers = (paginationParam) => {
    handleFetchUsers({
      pagination: paginationParam,
      onGotSuccess: onHandleFetchSuccess,
      setLoading,
    })
  }

  const onTableChange = (tablePagination) => {
    onHandleFetchUsers(tablePagination)
  }

  const refetchUsers = () => {
    onHandleFetchUsers(pagination);
  }

  useEffect(() => {
    onHandleFetchUsers(pagination)
  }, [])

  return (
    <UserManagementWrapper>
      <Table {...{
        title: () => (
          <div className='title-container'>
            <h1>
              User Management
            </h1>
            <OpenFormButton {...{
              onGotSuccess: refetchUsers,
            }}>
              Create User
            </OpenFormButton>
          </div>
        ),
        dataSource,
        onChange: onTableChange,
        loading,
        columns: userManagementTableColumns({
          refetchUsers,
        }),
        rowKey: '_id'
      }} />
    </UserManagementWrapper>
  )
}

const userManagementRoot = document.getElementById('user-management-root');
if (userManagementRoot) {
  ReactDOM.render(
    <UserManagement />,
    userManagementRoot
  )
}
