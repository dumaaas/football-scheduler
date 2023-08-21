import { Space, Table } from "antd";
import { UserKeys, UserRepository } from "../api/repositories/userRepository";
import useStore from "../store/store";
import { useQuery } from "@tanstack/react-query";
import Loader from "./Loader";

const UserList = () => {
  const userRepository = new UserRepository();
  const { user } = useStore();

  const { data: users, isLoading } = useQuery([UserKeys.USERS, user?.id], () =>
    userRepository.getAllUsers(user?.id)
  );

  const columns = [
    {
      title: "First name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
  ];

  console.log(users, 'users')

  if (isLoading) return <Loader />;

  return (
    <Space direction="vertical" className="pt-4 mx-auto justify-center  w-full">
      <Table dataSource={users} columns={columns} bordered showSorterTooltip />
    </Space>
  );
};

export default UserList;
