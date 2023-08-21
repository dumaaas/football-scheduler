import { Space, Typography, Tabs } from "antd";
import RegisterUser from "../components/RegisterUser";
import UserList from "../components/UserList";
import useStore from "../store/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const { Title, Paragraph } = Typography;

function Dashboard() {
  const { user } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "user") {
      navigate("/");
    }
    if (!user) {
      navigate("/login");
    }
  }, []);

  const tabs = [
    {
      label: "Register user",
      key: "1",
      children: <RegisterUser />,
    },
    {
      label: "User list",
      key: "2",
      children: <UserList />,
    },
  ];

  return (
    <Space direction="vertical" className="w-full py-[80px] justify-center">
      <Title className="text-center" level={3}>
        Register new user
      </Title>
      <Paragraph className="text-center text-gray-400">
        After you create a user, he can login to the website and see your games.
      </Paragraph>
      <Tabs defaultActiveKey="1" centered items={tabs} />
    </Space>
  );
}

export default Dashboard;
