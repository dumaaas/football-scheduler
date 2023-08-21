import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

type Props = {
  children: ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div>
      <Header />
      <main className="h-screen w-full container px-4 mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
