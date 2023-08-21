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
            var imgUrl =
              item.location === "Arena"
                ? "https://firebasestorage.googleapis.com/v0/b/football-scheduler-cde0c.appspot.com/o/arena.jpg?alt=media&token=05c71ec6-39e6-41be-95f5-386cf36eeb21"
                : item.location === "Sportski"
                ? "https://firebasestorage.googleapis.com/v0/b/football-scheduler-cde0c.appspot.com/o/sportski.jpg?alt=media&token=16325922-2e02-4e8f-8f81-392badf2dded"
                : "https://firebasestorage.googleapis.com/v0/b/football-scheduler-cde0c.appspot.com/o/humci.jpg?alt=media&token=fad12c44-1a94-4185-8597-f8d9d1e6677b";
            return (
              <Card
                key={item.id}
                onClick={() => navigate(`/game/${item.id}`)}
                className="w-[300px] relative z-20"
                hoverable
                cover={
                  <img
                    loading="lazy"
                    alt="example"
                    className="max-w-full object-cover h-[158px]"
                    src={imgUrl}
                  />
                }
              >
                <Meta
                  className="pb-8"
                  avatar={<Avatar src={item.providerData?.avatar} />}
                  title={item.location}
                  description={formatDate(item.date)}
                />
                <p className="absolute bottom-2 right-2 text-[#8C8C8C]">
                  created by {item.providerData?.username}
                </p>
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
