import { Space, Typography, Tabs } from "antd";
import RegisterUser from "../components/RegisterUser";
import UserList from "../components/UserList";
import useStore from "../store/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const { Title, Paragraph } = Typography;

function MyProfile() {
  const { user } = useStore();
  const navigate = useNavigate();

  return (
    <Space direction="vertical" className="w-full py-[80px] justify-center">
      <Title className="text-center" level={3}>
        {user?.firstName} {user?.lastName} profile
      </Title>
      <Paragraph className="text-center text-gray-400">
        Here you can update your personal informations
      </Paragraph>
      <RegisterUser isUpdate={true} />
    </Space>
  );
}

export default MyProfile;
