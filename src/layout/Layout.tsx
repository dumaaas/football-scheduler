import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

type Props = {
  children: ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div>
      <main className="h-screen w-full container px-4 mx-auto">
        <Header />
        {children}
        <Footer />
      </main>
    </div>
  );
}

export default Layout;
