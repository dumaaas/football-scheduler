import { Space, Typography, Button, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GameKeys, GameRepository } from "../api/repositories/gameRepository";

import useStore from "../store/store";
import { BotRepository } from "../api/repositories/botRepository";
import { useEffect, useState } from "react";

const { Title, Paragraph } = Typography;

type Props = {
  title: string;
  subtitle: string;
  gameId?: string;
  isUserJoined?: boolean;
  players:
    | ({
        id: string;
        firstName: any;
        lastName: any;
        role: any;
        username: any;
        email: any;
      } | null)[]
    | [];
};
function GameTitle({ title, subtitle, gameId, players, isUserJoined }: Props) {
  const gameRepository = new GameRepository();
  const botRepository = new BotRepository();

  const [sendMessage, setSendMessage] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { user, matchupString } = useStore();

  const mutation = useMutation(
    isUserJoined ? gameRepository.leaveGame : gameRepository.joinGame,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [GameKeys.GAME],
        });

        messageApi.open({
          type: "success",
          content: isUserJoined
            ? "You have left a game!"
            : "You have joined a game!",
        });
        setSendMessage(true);
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Something went wrong!",
        });
      },
    }
  );

  useEffect(() => {
    if (sendMessage) {
      var prepareMessage = isUserJoined
        ? `${user?.firstName} ${
            user?.lastName
          } left a game. 💔 \n\nThere are <b>${
            10 - players.length
          } places</b> available. ${matchupString} \n\n<a href="https://www&#46;example&#46;com">Join the game now!</a> 🔥 `
        : `${user?.firstName} ${
            user?.lastName
          } joined a game. 😎 \n\nThere are <b>${
            10 - players.length
          } places</b> available. ${matchupString} \n\n<a href="https://www&#46;example&#46;com">Join the game now!</a> 🔥`;

      if (players.length === 10) {
        prepareMessage = `${user?.firstName} ${user?.lastName} joined a game. 😎 \n\nTeams are completed now. ${matchupString} \n\n<a href="https://www&#46;example&#46;com">Check the game here!</a> 🔥`;
      }
      botRepository.sendMessage(prepareMessage, false);
      setSendMessage(false);
    }
  }, [sendMessage, matchupString]);

  const handleJoin = () => {
    if (user?.id && gameId) {
      mutation.mutate({ userId: user?.id.toString(), gameId: gameId });
    }
  };

  return (
    <Space direction="vertical" align="center" className="w-full">
      {contextHolder}

      <Title level={3} style={{ marginBottom: 0 }}>
        {title}
      </Title>
      <Paragraph className="text-gray-500">{subtitle}</Paragraph>
      <Button onClick={handleJoin}>
        {isUserJoined ? "Leave game" : "Join game"}
      </Button>
    </Space>
  );
}

export default GameTitle;
