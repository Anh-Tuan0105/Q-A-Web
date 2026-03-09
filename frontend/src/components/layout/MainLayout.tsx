import React from "react";
import { Outlet } from "react-router";
import Header from "../header/Header";
import Sider from "../sider/Sider";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* Main Layout Container */}
      <div className="flex flex-1 max-w-[1400px] w-full mx-auto pt-6">
        {/* Sider Area */}
        <Sider />

        {/* Main Content Area */}
        <main className="flex-1 ml-8 pr-8 pb-12 w-full max-w-5xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
