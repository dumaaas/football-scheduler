import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { GameKeys, GameRepository } from "../api/repositories/gameRepository";

import { formatDate } from "../helpers/helpers";

import { Space, Typography, Divider } from "antd";

import GameTitle from "../components/GameTitle";
import Loader from "../components/Loader";
import useStore from "../store/store";
import { useEffect, useState } from "react";
import { User } from "../api/types/types";

const { Paragraph } = Typography;

function Game() {
  const gameRepository = new GameRepository();
  const { gameId } = useParams();
  const { user, setMatchupString } = useStore();

  const [teamOne, setTeamOne] = useState<User[]>([]);
  const [teamTwo, setTeamTwo] = useState<User[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const { data: game, isLoading } = useQuery([GameKeys.GAME], async () => {
    const gameData = await gameRepository.getGameById(gameId, user?.id);
    return gameData;
  });

  function generateTeams(players: any) {
    setIsGenerating(true);
    const sortedPlayers = players.sort(
      (a: any, b: any) =>
        b.offensive +
        b.defensive +
        b.stamina -
        (a.offensive + a.defensive + a.stamina)
    );

    const team1 = [] as any;
    const team2 = [] as any;

    sortedPlayers.forEach((player: any, index: number) => {
      if (index % 2 === 0) {
        team1.push(player);
      } else {
        team2.push(player);
      }
    });

    return [team1, team2];
  }

  function generateMatchupString(teamOne: User[], teamTwo: User[]) {
    let matchupString = "\n\n";

    teamOne.forEach((player) => {
      matchupString += `${player.firstName} ${player.lastName}\n`;
    });

    matchupString += "\nvs\n\n";

    teamTwo.forEach((player) => {
      matchupString += `${player.firstName} ${player.lastName}\n`;
    });

    return matchupString;
  }

  useEffect(() => {
    if (game && game?.players.length > 0) {
      if (game.players) {
        const [team1, team2] = generateTeams(game?.players);
        setTeamOne(team1);
        setTeamTwo(team2);

        const matchupString = generateMatchupString(team1, team2);
        setMatchupString(matchupString);
        setTimeout(() => {
          setIsGenerating(false);
        }, 1000);
      }
    }
  }, [game?.players]);

  console.log(teamTwo, "hej?");

  if (isLoading) return <Loader />;

  return (
    <Space direction="vertical" className="py-[80px] w-full">
      <GameTitle
        isUserJoined={game?.isUserJoined}
        players={game ? game.players : []}
        gameId={gameId}
        title={game?.location}
        subtitle={formatDate(game?.date)}
      />
      <Divider />
      <Space direction="vertical" align="center" className="w-full"></Space>
      <Space
        direction="vertical"
        align="center"
        className="justify-center w-full"
      >
        {game?.players ? (
          <Paragraph>
            {game?.players.length < 9 &&
              `Join a game! There are still ${
                10 - game?.players.length
              } places available.`}
            {game?.players.length === 9 &&
              `Join a game! There is only 1 place available.`}
            {game?.players.length === 10 && "We are full! 🤰"}
          </Paragraph>
        ) : null}
        <div className="w-[300px] h-[450px] border border-gray-400 relative">
          <div className="w-full h-[1px] bg-gray-400 absolute translate-y-[-50%] top-[50%]"></div>
          <div className="w-[150px] h-[150px] border border-gray-400 translate-x-[-50%] left-[50%] rounded-full absolute translate-y-[-50%] top-[50%]"></div>
          <div className="w-[10px] h-[10px] border border-gray-400 bg-gray-400 translate-x-[-50%] left-[50%] rounded-full absolute translate-y-[-50%] top-[50%]"></div>
          <div className="absolute top-0 w-[150px] h-[80px] bg-white z-20 border border-gray-400 border-t-transparent translate-x-[-50%] left-[50%]"></div>
          <div className="absolute w-[150px] h-[80px] bg-white border z-20 border-gray-400 border-b-transparent translate-x-[-50%] left-[50%] bottom-0"></div>
          <div className="absolute w-[60px] h-[60px] top-[50px] rounded-full z-10 translate-x-[-50%] left-[50%] border border-gray-400"></div>
          <div className="absolute w-[60px] h-[60px] bottom-[50px] rounded-full z-10 translate-x-[-50%] left-[50%] border border-gray-400"></div>
          {!isGenerating ? (
            <>
              <div className="absolute top-[16px] left-[50%] translate-x-[-50%] z-30 flex flex-col items-center justify-center gap-2">
                <div
                  style={{
                    backgroundImage:
                      teamOne[0] && teamOne[0].avatar
                        ? `url(${teamOne[0].avatar})`
                        : "",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                  }}
                  className="flex items-center justify-center w-[40px] h-[40px] bg-blue-500 border border-gray-700  rounded-full"
                >
                  <Paragraph className="!mb-0 text-white text-xl font-bold">
                    {teamOne[0] ? "" : "?"}
                  </Paragraph>
                </div>{" "}
                <Paragraph className="bg-gray-700 rounded-lg text-white px-2 !mb-0">
                  {teamOne[0] ? teamOne[0].username : "Free slot"}
                </Paragraph>
              </div>
              <div className="absolute top-[60px] left-[20px] z-30 flex flex-col items-center justify-center gap-2">
                <div
                  style={{
                    backgroundImage:
                      teamOne[1] && teamOne[1].avatar
                        ? `url(${teamOne[1].avatar})`
                        : "",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                  }}
                  className="flex items-center justify-center bg-blue-500 w-[40px] h-[40px] border border-gray-700  rounded-full"
                >
                  <Paragraph className="!mb-0 text-white text-xl font-bold">
                    {teamOne[1] ? "" : "?"}
                  </Paragraph>
                </div>
                <Paragraph className="bg-gray-700 rounded-lg text-white px-2 !mb-0">
                  {teamOne[1] ? teamOne[1].username : "Free slot"}
                </Paragraph>
              </div>
              <div className="absolute top-[60px] right-[20px] z-30 flex flex-col items-center justify-center gap-2">
                <div
                  style={{
                    backgroundImage:
                      teamOne[2] && teamOne[2].avatar
                        ? `url(${teamOne[2].avatar})`
                        : "",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                  }}
                  className="flex items-center justify-center bg-blue-500 w-[40px] h-[40px] border border-gray-700  rounded-full"
                >
                  <Paragraph className="!mb-0 text-white text-xl font-bold">
                    {teamOne[2] ? "" : "?"}
                  </Paragraph>
                </div>
                <Paragraph className="bg-gray-700 rounded-lg text-white px-2 !mb-0">
                  {teamOne[2] ? teamOne[2].username : "Free slot"}
                </Paragraph>
              </div>
              <div className="absolute top-[33%] left-[20%] z-30 flex flex-col items-center justify-center gap-2">
                <div
                  style={{
                    backgroundImage:
                      teamOne[3] && teamOne[3].avatar
                        ? `url(${teamOne[3].avatar})`
                        : "",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                  }}
                  className="flex items-center justify-center bg-blue-500 w-[40px] h-[40px] border border-gray-700  rounded-full"
                >
                  <Paragraph className="!mb-0 text-white text-xl font-bold">
                    {teamOne[3] ? "" : "?"}
                  </Paragraph>
                </div>
                <Paragraph className="bg-gray-700 rounded-lg text-white px-2 !mb-0">
                  {teamOne[3] ? teamOne[3].username : "Free slot"}
                </Paragraph>
              </div>
              <div className="absolute top-[33%] right-[20%] z-30 flex flex-col items-center justify-center gap-2">
                <div
                  style={{
                    backgroundImage:
                      teamOne[4] && teamOne[4].avatar
                        ? `url(${teamOne[4].avatar})`
                        : "",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                  }}
                  className="flex items-center justify-center bg-blue-500 w-[40px] h-[40px] border border-gray-700  rounded-full"
                >
                  <Paragraph className="!mb-0 text-white text-xl font-bold">
                    {teamOne[4] ? "" : "?"}
                  </Paragraph>
                </div>
                <Paragraph className="bg-gray-700 rounded-lg text-white px-2 !mb-0">
                  {teamOne[4] ? teamOne[4].username : "Free slot"}
                </Paragraph>
              </div>
              <div className="absolute bottom-[16px] left-[50%] translate-x-[-50%] z-30 flex flex-col items-center justify-center gap-2">
                <div
                  style={{
                    backgroundImage:
                      teamTwo[0] && teamTwo[0].avatar
                        ? `url(${teamTwo[0].avatar})`
                        : "",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                  }}
                  className="flex items-center justify-center bg-blue-500 w-[40px] h-[40px] border border-gray-700  rounded-full"
                >
                  <Paragraph className="!mb-0 text-white text-xl font-bold">
                    {teamTwo[0] ? "" : "?"}
                  </Paragraph>
                </div>
                <Paragraph className="bg-gray-700 rounded-lg text-white px-2 !mb-0">
                  {teamTwo[0] ? teamTwo[0].username : "Free slot"}
                </Paragraph>
              </div>
              <div className="absolute bottom-[60px] left-[20px] z-30 flex flex-col items-center justify-center gap-2">
                <div
                  style={{
                    backgroundImage:
                      teamTwo[1] && teamTwo[1].avatar
                        ? `url(${teamTwo[1].avatar})`
                        : "",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                  }}
                  className="flex items-center justify-center bg-blue-500 w-[40px] h-[40px] border border-gray-700  rounded-full"
                >
                  <Paragraph className="!mb-0 text-white text-xl font-bold">
                    {teamTwo[1] ? "" : "?"}
                  </Paragraph>
                </div>
                <Paragraph className="bg-gray-700 rounded-lg text-white px-2 !mb-0">
                  {teamTwo[1] ? teamTwo[1].username : "Free slot"}
                </Paragraph>
              </div>
              <div className="absolute bottom-[60px] right-[20px] z-30 flex flex-col items-center justify-center gap-2">
                <div
                  style={{
                    backgroundImage:
                      teamTwo[2] && teamTwo[2].avatar
                        ? `url(${teamTwo[2].avatar})`
                        : "",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                  }}
                  className="flex items-center justify-center bg-blue-500 w-[40px] h-[40px] border border-gray-700  rounded-full"
                >
                  <Paragraph className="!mb-0 text-white text-xl font-bold">
                    {teamTwo[2] ? "" : "?"}
                  </Paragraph>
                </div>
                <Paragraph className="bg-gray-700 rounded-lg text-white px-2 !mb-0">
                  {teamTwo[2] ? teamTwo[2].username : "Free slot"}
                </Paragraph>
              </div>
              <div className="absolute bottom-[33%] left-[20%] z-30 flex flex-col items-center justify-center gap-2">
                <div
                  style={{
                    backgroundImage:
                      teamTwo[3] && teamTwo[3].avatar
                        ? `url(${teamTwo[3].avatar})`
                        : "",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                  }}
                  className="flex items-center justify-center bg-blue-500 w-[40px] h-[40px] border border-gray-700  rounded-full"
                >
                  <Paragraph className="!mb-0 text-white text-xl font-bold">
                    {teamTwo[3] ? "" : "?"}
                  </Paragraph>
                </div>
                <Paragraph className="bg-gray-700 rounded-lg text-white px-2 !mb-0">
                  {teamTwo[3] ? teamTwo[3].username : "Free slot"}
                </Paragraph>
              </div>
              <div className="absolute bottom-[33%] right-[20%] z-30 flex flex-col items-center justify-center gap-2">
                <div
                  style={{
                    backgroundImage:
                      teamTwo[4] && teamTwo[4].avatar
                        ? `url(${teamTwo[4].avatar})`
                        : "",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                  }}
                  className="flex items-center justify-center bg-blue-500 w-[40px] h-[40px] border border-gray-700  rounded-full"
                >
                  <Paragraph className="!mb-0 text-white text-xl font-bold">
                    {teamTwo[4] ? "" : "?"}
                  </Paragraph>
                </div>
                <Paragraph className="bg-gray-700 rounded-lg text-white px-2 !mb-0">
                  {teamTwo[4] ? teamTwo[4].username : "Free slot"}
                </Paragraph>
              </div>
            </>
          ) : (
            <Space className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]">
              <Loader />
            </Space>
          )}
        </div>
      </Space>
    </Space>
  );
}

export default Game;
