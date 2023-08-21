import { Button, Input, Space, message, Typography, Select } from "antd";
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import { User } from "../api/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserKeys, UserRepository } from "../api/repositories/userRepository";
import { object, string } from "yup";
import useStore from "../store/store";

const { Paragraph, Title } = Typography;

const RegisterUser = () => {
  const userRepository = new UserRepository();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { user } = useStore();

  const initialValues = {
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    role: "user",
    id: "",
  } as User;

  var validationSchema = object({
    username: string().required("Username is required"),
    email: string().email("Email is not valid").required("Email is required"),
    lastName: string().required("Last Name is required"),
    firstName: string().required("First Name is required"),
    role: string().required("Role is required"),
  });

  const mutation = useMutation(userRepository.registerUser, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [UserKeys.USERS],
      });
      messageApi.open({
        type: "success",
        content: "User is registered!",
      });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Something went wrong!",
      });
    },
  });

  const handleSubmit = (
    values: User,
    resetForm: (initialValues: User) => void
  ) => {
    if (user) values.providerId = user.id;

    mutation.mutate(values);
    resetForm(initialValues);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values: User, { resetForm }: { resetForm: () => void }) =>
        handleSubmit(values, resetForm)
      }
    >
      <Form className="flex items-center justify-center py-8 flex-col">
        <Title level={4} className="">
          Enter user data
        </Title>
        <Space direction="vertical" className="pt-4 w-[600px] mx-auto">
          {contextHolder}
          <Field name="firstName">
            {(fieldProps: FieldProps) => (
              <>
                <Input
                  {...fieldProps.field}
                  placeholder="First Name"
                  size="large"
                />
                <Paragraph className="!mb-0 text-red-500 text-[12px] pl-2 pt-[2px]">
                  <ErrorMessage name="firstName" component="div" />
                </Paragraph>
              </>
            )}
          </Field>
          <Field name="lastName">
            {(fieldProps: FieldProps) => (
              <>
                <Input
                  {...fieldProps.field}
                  placeholder="Last Name"
                  size="large"
                />
                <Paragraph className="!mb-0 text-red-500 text-[12px] pl-2 pt-[2px]">
                  <ErrorMessage name="lastName" component="div" />
                </Paragraph>{" "}
              </>
            )}
          </Field>
          <Field name="username">
            {(fieldProps: FieldProps) => (
              <>
                <Input
                  {...fieldProps.field}
                  placeholder="Username"
                  size="large"
                />
                <Paragraph className="!mb-0 text-red-500 text-[12px] pl-2 pt-[2px]">
                  <ErrorMessage name="username" component="div" />
                </Paragraph>{" "}
              </>
            )}
          </Field>
          <Field name="email">
            {(fieldProps: FieldProps) => (
              <>
                <Input {...fieldProps.field} placeholder="Email" size="large" />
                <Paragraph className="!mb-0 text-red-500 text-[12px] pl-2 pt-[2px]">
                  <ErrorMessage name="email" component="div" />
                </Paragraph>{" "}
              </>
            )}
          </Field>
          <Field name="role">
            {(fieldProps: FieldProps) => (
              <>
                <Select
                  size="large"
                  className="w-full"
                  defaultValue="user"
                  value={fieldProps.field.value}
                  onChange={(value) =>
                    fieldProps.form.setFieldValue(fieldProps.field.name, value)
                  }
                  options={[
                    { value: "user", label: "User" },
                    { value: "provider", label: "Provider" },
                  ]}
                />
              </>
            )}
          </Field>

          <Button
            type="primary"
            typeof="submit"
            htmlType="submit"
            color="red"
            className="bg-blue-500 mt-2 w-full"
          >
            Create user
          </Button>
        </Space>
      </Form>
    </Formik>
  );
};

export default RegisterUser;
