import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Space, Input, Typography, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { UserKeys, UserRepository } from "../api/repositories/userRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Loader from "../components/Loader";
import useStore from "../store/store";

const { Title, Paragraph } = Typography;

function Login() {
  const userRepository = new UserRepository();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const { user, setIsLoggedIn, setUser } = useStore();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(user, 'USERRRUUU')
    if (user) navigate("/");
  }, [user]);

  const userLogin = () => {
    mutation.mutate({ email: email, password: password });
  };

  const mutation = useMutation(userRepository.logIn, {
    onSuccess: (data) => {
      userRepository.getUserData(data.user.uid).then((data) => {
        if (data) {
          setIsLoggedIn(true);
          setUser({
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            email: data.email,
            role: data.role,
            offensive: data.offensive,
            defensive: data.defensive,
            stamina: data.stamina,
            providerId: data.providerId,
            avatar: data.avatar,
          });
        }
      });

      queryClient.invalidateQueries({
        queryKey: [UserKeys.USER],
      });
    },
    onError: (error) => {
      console.log("Error: ", error);
      setError(true);
    },
  });

  useEffect(() => {
    if (error) setError(false);
  }, [email, password]);

  if (mutation.isLoading) return <Loader />;

  return (
    <Space className="py-[80px] flex items-center justify-center h-full">
      <Space
        direction="vertical"
        className="flex justify-center w-full p-6 rounded-xl shadow-2xl max-w-[420px]"
      >
        <Space className="border-b w-full">
          <Title level={3}>Login</Title>
        </Space>
        <Space direction="vertical" className="pt-4">
          <Input
            size="large"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            prefix={<UserOutlined className="text-gray-400" />}
          />
          <Input.Password
            size="large"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            prefix={<LockOutlined className="text-gray-400" />}
            visibilityToggle={{
              visible: passwordVisible,
              onVisibleChange: setPasswordVisible,
            }}
          />

          {error ? (
            <Paragraph className="text-red-500">
              Wrong username or password
            </Paragraph>
          ) : null}
          <Button
            type="primary"
            color="red"
            className="bg-blue-500 mt-2 w-full"
            onClick={userLogin}
          >
            Login
          </Button>
        </Space>
      </Space>
    </Space>
  );
}

export default Login;
