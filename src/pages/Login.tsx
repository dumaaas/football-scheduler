import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Space, Input, Typography, Button, message, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { UserKeys, UserRepository } from "../api/repositories/userRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Loader from "../components/Loader";
import useStore from "../store/store";
import { CheckboxChangeEvent } from "antd/es/checkbox";

const { Title, Paragraph } = Typography;

function Login() {
  const userRepository = new UserRepository();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isResetPassword, setIsResetPassword] = useState<boolean>(false);

  const { user, setIsLoggedIn, setUser, setRememberMe } = useStore();
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const pastRoute = document.referrer;

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const userLogin = () => {
    if (isResetPassword) {
      resetMutation.mutate(email);
    } else {
      mutation.mutate({ email: email, password: password });
    }
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

      if (pastRoute && pastRoute.includes("game")) {
        navigate(`/game/${pastRoute.split("/").pop()}`);
      } else {
        navigate("/");
      }

      queryClient.invalidateQueries({
        queryKey: [UserKeys.USER],
      });
    },
    onError: (error) => {
      console.log("Error: ", error);
      setError(true);
    },
  });

  const resetMutation = useMutation(userRepository.resetPassword, {
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Password reset email sent.",
      });

      queryClient.invalidateQueries({
        queryKey: [UserKeys.USER],
      });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Invalid email.",
      });
    },
  });

  useEffect(() => {
    if (error) setError(false);
  }, [email, password]);

  if (mutation.isLoading) return <Loader />;

  return (
    <Space className="py-[80px] flex items-center justify-center h-full">
      {contextHolder}
      <Space
        direction="vertical"
        className="flex justify-center w-full p-6 rounded-xl shadow-2xl max-w-[420px]"
      >
        <Space className="border-b w-full">
          <Title level={3}>
            {isResetPassword ? "Reset passowrd" : "Login"}
          </Title>
        </Space>
        <Space direction="vertical" className="pt-4">
          <Input
            size="large"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            prefix={<UserOutlined className="text-gray-400" />}
          />

          {!isResetPassword && (
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
          )}

          <div className="flex items-center flex-row justify-between">
            <Checkbox
              onChange={(e: CheckboxChangeEvent) =>
                setRememberMe(e.target.checked)
              }
            >
              Remember me
            </Checkbox>
            <Paragraph
              onClick={() => setIsResetPassword(!isResetPassword)}
              className="text-blue-500 hover:underline flex items-end justify-end cursor-pointer !mb-0"
            >
              {isResetPassword ? "Back to login" : "Reset password"}
            </Paragraph>
          </div>

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
