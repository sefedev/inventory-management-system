'use client'

import StoreProvider, { useAppSelector } from '../../redux';
import React, { useEffect } from 'react'
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const DashboardLayout = ({children}) => {
  const session = useSession()


    const isSideBarCollapsed = useAppSelector(
      (state) => state.global.isSideBarCollapsed
    );
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  
    useEffect(() => {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.add("light");
      }
    });
    if (!session || session.status !== 'authenticated') redirect('/')
    return (
      <div
        className={`${
          isDarkMode ? "dark" : "light"
        } flex bg-gray-50 text-gray-900 w-full min-h-screen`}
      >
       <Sidebar />
        <main
          className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${
            isSideBarCollapsed ? "md:pl-24" : "md:pl-72"
          } `}
        >
          <Navbar />
          {children}
        </main>
      </div>
    )
  }

const DashboardWrapper = ({ children }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;