import { notification } from "antd";

export const handleFetchUsers = async ({
  pagination,
  onGotSuccess,
  setLoading,
}) => {
  if (setLoading) setLoading(true);
  const { current = 0, pageSize = 20 } = pagination;
  const searchParams = new URLSearchParams();

  searchParams.append('skip', current * pageSize);
  searchParams.append('limit', pageSize);

  const apiUrl = `/api/user?${searchParams.toString()}`;

  try {
    const response = await fetch(apiUrl);
    const jsonData = await response.json();

    if (onGotSuccess) onGotSuccess(jsonData);
  } catch (error) {
    notification.error({
      message: error.message,
    });
  }
  if (setLoading) setLoading(false);
};

export const handleUpdateUser = async ({
  userId,
  values,
  onGotSuccess,
}) => {
  const response = await fetch(`/api/user/${userId}`, {
    body: JSON.stringify(values),
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const jsonData = await response.json();
  if (onGotSuccess) onGotSuccess(jsonData);

  return jsonData;
}

export const handleCreateUser = async ({
  values,
  onGotSuccess,
}) => {
  const response = await fetch('/api/user', {
    body: JSON.stringify(values),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  const jsonData = await response.json();
  if (onGotSuccess) onGotSuccess(jsonData);

  return jsonData;
}

export const handleDeleteUser = async ({
  userId,
  onGotSuccess,
}) => {
  const response = await fetch(`/api/user/${userId}`, {
    method: 'DELETE',
  });
  const jsonData = await response.json();
  if (onGotSuccess) onGotSuccess(jsonData);

  return jsonData;
}
