"use client";

import { useAppDispatch, useAppSelector } from "../../../redux";
import { setIsDarkMode, setIsSideBarCollapsed } from "../../../state";
import { Bell, Menu, Moon, Settings, Sun } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const session = useSession();

  const dispatch = useAppDispatch();

  const isSideBarCollapsed = useAppSelector(
    (state) => state.global.isSideBarCollapsed
  );

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Dropdown for Signout on hover Profile Image/name
  const [openDropdown, setOpenDropdown] = useState();

  const toggleSideBar = () => {
    dispatch(setIsSideBarCollapsed(!isSideBarCollapsed));
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  return (
    <div className="flex justify-between items-center mb-7">
      {/* LEFT SIDE */}
      <div className="flex justify-between items-center gap-2">
        <button
          className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSideBar}
        >
          <Menu className="size-4" />
        </button>

        {/* <div className="relative">
          <input
            type="search"
            placeholder="Start to search groups & products"
            className="pl-10 pr-4 py-2 w-50 md:w-60 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Bell className="text-gray-500 " size={20} />
          </div>
        </div> */}
      </div>
      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-3">
        <div className="flex justify-between items-center gap-5">
          <div>
            <button onClick={toggleDarkMode}>
              {isDarkMode ? (
                <Sun className="cursor-pointer text-gray-500" size={24} />
              ) : (
                <Moon className="cursor-pointer text-gray-500" size={24} />
              )}
            </button>
          </div>
          {/* <div className="relative">
            <Bell className="cursor-pointer text-gray-500" size={24} />
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400 rounded-full">
              3
            </span>
          </div> */}
          <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-1" />
          {/* PROFILE NAME AND AVATAR */}
          <div
            className="flex relative items-center gap-1 cursor-pointer"
            onMouseEnter={() => setOpenDropdown(true)}
            onMouseLeave={() => setOpenDropdown(false)}
          >
            {openDropdown && (
              <div className="absolute inset-6 z-50 mt-2 w-24 h-fit bg-white rounded-md shadow-lg">
                
                  <button
                    className="cursor-pointer p-2 rounded hover:bg-gray-200 text-xs w-full"
                    onClick={() => signOut()}
                  >
                    Logout
                  </button>
                
              </div>
            )}
            <span className="font-semibold line-clamp-1">
              {session.data.user.name}
            </span>
            <img
              className="rounded-full border-1 border-gray-400"
              src={session.data.user.image}
              alt="avatar"
              width={30}
              height={30}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
