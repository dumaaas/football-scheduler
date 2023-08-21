import logo from "../logo.svg";

import { Button } from "antd";

import { UserKeys, UserRepository } from "../api/repositories/userRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useStore from "../store/store";

function Header() {
  const userRepository = new UserRepository();
  const { setIsLoggedIn, setUser } = useStore();

  const queryClient = useQueryClient();

  const mutation = useMutation(userRepository.signOut, {
    onSuccess: () => {
      setIsLoggedIn(true);
      setUser(null);
      queryClient.invalidateQueries({
        queryKey: [UserKeys.USER],
      });
    },
    onError: (error) => {
      console.log("Error: ", error);
    },
  });

  const handleLogOut = () => {
    mutation.mutate();
  };
  return (
    <header className=" fixed top-0 left-0 bg-gray-800 border-b w-full z-50 border-b-red-300 text-white">
      <div className="container px-4 mx-auto flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-1">
          <img src={logo} className="w-[60px] h-[60px]" alt="logo" />
          <p className="font-bold">Football Scheduler</p>
        </div>
        <Button type="default" className="text-white" onClick={handleLogOut}>
          Sign out
        </Button>
      </div>
    </header>
  );
}

export default Header;
