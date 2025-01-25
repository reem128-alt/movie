import { Outlet } from "react-router";
import Header from "../../components/header"

export const Master = () => {
  return (
    <div className="bg-[#0a0a0c] w-full">
      <Header />
      <main className="flex flex-col min-h-screen  px-4 py-6">
        <Outlet />
      </main>
      
    </div>
  );
};
