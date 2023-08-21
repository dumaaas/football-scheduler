import { DatePicker, Space, Typography, Select, Button, message } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TimePicker } from "antd";
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import {
  formatOnlyDate,
  formatTime,
  formatTimestamp,
} from "../helpers/helpers";
import useStore from "../store/store";
import { Game } from "../api/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GameKeys, GameRepository } from "../api/repositories/gameRepository";
import { BotRepository } from "../api/repositories/botRepository";

const format = "HH:mm";
const { Title, Paragraph } = Typography;

dayjs.extend(customParseFormat);

const initialValues = {
  date: null,
  time: null,
  location: "Arena",
};

function GameScheduler() {
  const { user, botMessage, setBotMessage } = useStore();
  const gameRepository = new GameRepository();
  const botRepository = new BotRepository();

  const [messageApi, contextHolder] = message.useMessage();

  const queryClient = useQueryClient();

  const mutation = useMutation(gameRepository.scheduleGame, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GameKeys.GAMES],
      });

      botRepository.sendMessage(botMessage, true);

      messageApi.open({
        type: "success",
        content: "Game is scheduled!",
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
    values: any,
    resetForm: (initialValues: any) => void
  ) => {
    const timestampDate = formatTimestamp(values.date, values.time);
    const gameObj = {
      id: "0",
      date: timestampDate,
      location: values.location,
      providerId: user?.id,
      players: [],
    } as Game;
    const prepareBotMessage = `Hey football fanatics! 🚀 \n\n${
      user?.firstName
    } ${user?.lastName} created a new game. ⚽ \n\n📍 ${
      values.location
    } \n🗓️ ${formatOnlyDate(values.date)} \n🕒 ${formatTime(values.time)}
     \n\n<a href="https://www&#46;example&#46;com">Join the game now!</a> 🔥`;
    setBotMessage(prepareBotMessage);
    mutation.mutate(gameObj);
    resetForm(initialValues);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { resetForm }: { resetForm: () => void }) => {
        if (user?.role !== "user") {
          handleSubmit(values, resetForm);
        }
        messageApi.open({
          type: "error",
          content: "You don't have permissions for this action!",
        });
      }}
    >
      <Form>
        {contextHolder}
        <Space direction="vertical" align="center" className="w-full">
          <Title level={3}>Schedule a game</Title>
          <Space direction="horizontal" wrap align="center">
            <Field name="date">
              {(fieldProps: FieldProps) => (
                <>
                  <DatePicker
                    value={fieldProps.field.value}
                    onChange={(date, dateString) => {
                      console.log(date, dateString);
                      fieldProps.form.setFieldValue(
                        fieldProps.field.name,
                        date
                      );
                    }}
                  />
                  <Paragraph className="!mb-0 text-red-500 text-[12px] pl-2 pt-[2px]">
                    <ErrorMessage name="date" component="div" />
                  </Paragraph>
                </>
              )}
            </Field>

            <Field name="time">
              {(fieldProps: FieldProps) => (
                <>
                  <TimePicker
                    defaultValue={dayjs("12:08", format)}
                    value={fieldProps.field.value}
                    format={format}
                    onChange={(time, timeString) => {
                      console.log(time, timeString);
                      fieldProps.form.setFieldValue(
                        fieldProps.field.name,
                        time
                      );
                    }}
                  />
                  <Paragraph className="!mb-0 text-red-500 text-[12px] pl-2 pt-[2px]">
                    <ErrorMessage name="time" component="div" />
                  </Paragraph>
                </>
              )}
            </Field>
            <Field name="location">
              {(fieldProps: FieldProps) => (
                <>
                  <Select
                    defaultValue="arena"
                    value={fieldProps.field.value}
                    style={{ width: 120 }}
                    onChange={(value) =>
                      fieldProps.form.setFieldValue(
                        fieldProps.field.name,
                        value
                      )
                    }
                    options={[
                      { value: "Arena", label: "Arena" },
                      { value: "Sportski", label: "Sportski" },
                      { value: "Humci", label: "Humci" },
                    ]}
                  />
                </>
              )}
            </Field>
          </Space>
          <Button htmlType="submit" className="mt-4">
            Schedule
          </Button>
        </Space>
      </Form>
    </Formik>
  );
}

export default GameScheduler;
