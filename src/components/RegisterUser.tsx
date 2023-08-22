import {
  Button,
  Upload,
  Input,
  Space,
  message,
  Typography,
  Select,
} from "antd";
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import { User } from "../api/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserKeys, UserRepository } from "../api/repositories/userRepository";
import { object, string } from "yup";
import useStore from "../store/store";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Paragraph } = Typography;

type Props = {
  isUpdate?: boolean;
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const initialValuesTemp = {
  email: "",
  username: "",
  firstName: "",
  lastName: "",
  role: "user",
  id: "",
  avatar: "",
  stamina: undefined,
  offensive: undefined,
  defensive: undefined,
  providerId: "",
} as User;

const RegisterUser = ({ isUpdate = false }: Props) => {
  const [initialValues, setInitialValues] = useState<User>(initialValuesTemp);
  const userRepository = new UserRepository();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { user, setUser } = useStore();

  useEffect(() => {
    if (isUpdate && user) {
      console.log("sjebe li ovo?");
      setInitialValues(user);
      setImageUrl(user.avatar);
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    setLoading(true);
    userRepository
      .uploadProduct(info.file.originFileObj as Blob)
      .then((data) => {
        setImageUrl(data);
        setLoading(false);
      });
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload avatar</div>
    </div>
  );

  var validationSchema = object({
    username: string().required("Username is required"),
    email: string().email("Email is not valid").required("Email is required"),
    lastName: string().required("Last Name is required"),
    firstName: string().required("First Name is required"),
    role: string().required("Role is required"),
    stamina: string().required("Stamina is required"),
    offensive: string().required("Offensive is required"),
    defensive: string().required("Defensive is required"),
  });

  const mutation = useMutation(
    !isUpdate ? userRepository.registerUser : userRepository.updateUser,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [UserKeys.USERS],
        });
        messageApi.open({
          type: "success",
          content: !isUpdate ? "User is registered!" : "Successfully updated!",
        });
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Something went wrong!",
        });
      },
    }
  );

  const handleSubmit = (
    values: User,
    resetForm: (initialValues: User) => void
  ) => {
    if (user) values.providerId = user.id;
    if (imageUrl && imageUrl.length) values.avatar = imageUrl;
    mutation.mutate(values);

    if (!isUpdate) {
      resetForm(initialValues);
      setImageUrl("");
    } else {
      setUser(values);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={(values: User, { resetForm }: { resetForm: () => void }) =>
        handleSubmit(values, resetForm)
      }
    >
      <Form className="flex items-center justify-center py-8 flex-col">
        <Space direction="vertical" className="w-[600px] mx-auto overflow-hidden">
          {contextHolder}
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader overflow-hidden"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" className="object-cover object-center rounded" />
            ) : (
              uploadButton
            )}
          </Upload>

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
          {!isUpdate && (
            <>
              <Field name="stamina">
                {(fieldProps: FieldProps) => (
                  <>
                    <Input
                      {...fieldProps.field}
                      type="number"
                      placeholder="Stamina"
                      size="large"
                    />
                    <Paragraph className="!mb-0 text-red-500 text-[12px] pl-2 pt-[2px]">
                      <ErrorMessage name="stamina" component="div" />
                    </Paragraph>{" "}
                  </>
                )}
              </Field>

              <Field name="offensive">
                {(fieldProps: FieldProps) => (
                  <>
                    <Input
                      {...fieldProps.field}
                      type="number"
                      placeholder="Offensive"
                      size="large"
                    />
                    <Paragraph className="!mb-0 text-red-500 text-[12px] pl-2 pt-[2px]">
                      <ErrorMessage name="offensive" component="div" />
                    </Paragraph>{" "}
                  </>
                )}
              </Field>
              <Field name="defensive">
                {(fieldProps: FieldProps) => (
                  <>
                    <Input
                      {...fieldProps.field}
                      type="number"
                      placeholder="Defensive"
                      size="large"
                    />
                    <Paragraph className="!mb-0 text-red-500 text-[12px] pl-2 pt-[2px]">
                      <ErrorMessage name="defensive" component="div" />
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
                        fieldProps.form.setFieldValue(
                          fieldProps.field.name,
                          value
                        )
                      }
                      options={[
                        { value: "user", label: "User" },
                        { value: "provider", label: "Provider" },
                      ]}
                    />
                  </>
                )}
              </Field>
            </>
          )}
          <Button
            type="primary"
            typeof="submit"
            htmlType="submit"
            color="red"
            className="bg-blue-500 mt-2 w-full"
          >
            {!isUpdate ? "Create user" : "Update user"}
          </Button>
        </Space>
      </Form>
    </Formik>
  );
};

export default RegisterUser;
