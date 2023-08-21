import { useQuery } from "@tanstack/react-query";
import { GameKeys, GameRepository } from "../api/repositories/gameRepository";

import { formatDate } from "../helpers/helpers";

import { Space, Typography, Avatar, Card, Badge, Divider } from "antd";

import { EditOutlined, CheckOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import GameScheduler from "../components/GameScheduler";
import Loader from "../components/Loader";
import useStore from "../store/store";

const { Title } = Typography;
const { Meta } = Card;

function Home() {
  const gameRepository = new GameRepository();
  const { user } = useStore();

  const navigate = useNavigate();

  const payloadId =
    user?.role === "super-admin" || user?.role === "provider"
      ? user?.id
      : user?.providerId;

  console.log(payloadId, "hej?");
  const { data: games, isLoading } = useQuery([GameKeys.GAMES, payloadId], () =>
    gameRepository.getAllGames(payloadId)
  );

  if (isLoading) return <Loader />;

  return (
    <Space direction="vertical" className="w-full py-[80px]">
      <GameScheduler />
      <Divider />
      <Space direction="vertical" align="center" className="w-full">
        <Title level={3} className="text-center">
          Active games
        </Title>
        <Space
          wrap
          align="center"
          className="flex justify-center mt-4"
          style={{ rowGap: "30px", columnGap: "30px" }}
          direction="horizontal"
        >
          {games?.map((item) => {
            return (
              <Card
                key={item.id}
                onClick={() => navigate(`/game/${item.id}`)}
                className="w-[300px] relative z-20"
                hoverable
                cover={
                  <img
                    alt="example"
                    className="max-w-full object-cover h-[158px]"
                    src={"/images/" + item.location + ".jpg"}
                  />
                }
                actions={[
                  <CheckOutlined key="check" />,
                  <EditOutlined key="edit" />,
                  <EyeOutlined key="ey" />,
                ]}
              >
                <Meta
                  avatar={
                    <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
                  }
                  title={item.location}
                  description={formatDate(item.date)}
                />
                <div className="absolute top-[-2px] right-0 z-10">
                  <Badge.Ribbon
                    text={`${item.players?.length}/10`}
                  ></Badge.Ribbon>
                </div>
              </Card>
            );
          })}
        </Space>
      </Space>
    </Space>
  );
}

export default Home;
