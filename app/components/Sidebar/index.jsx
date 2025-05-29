"use client";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { setIsSideBarCollapsed } from "../../../state";
import {
  Archive,
  Layout,
  LucideIcon,
  Menu,
  Clipboard,
  User,
  SlidersHorizontal,
  CircleDollarSign,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        } hover:text-blue-500 hover:bg-blue-100 transition-colors gap-3 ${
          isActive ? "bg-blue-200 text-white" : ""
        }`}
      >
        <Icon className="size-6 !text-gray-700" />
        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-gray-700`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();

  const isSideBarCollapsed = useAppSelector(
    (state) => state.global.isSideBarCollapsed
  );

  const toggleSideBar = () => {
    dispatch(setIsSideBarCollapsed(!isSideBarCollapsed));
  };

  const sideBarClassNames = `fixed flex flex-col ${
    isSideBarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;
  return (
    <div className={sideBarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isSideBarCollapsed ? "px-4" : "px-8"
        }`}
      >
        <div className="rounded-full px-2.5 py-1 font-bold bg-gray-700 text-gray-300">S</div>
        <h1
          className={`font-extrabold text-xl ${
            isSideBarCollapsed ? "hidden" : "block"
          }`}
        >
          SEFSTOCK
        </h1>

        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSideBar}
        >
          <Menu className="size-4" />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-8">
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          label="Dashboard"
          isCollapsed={isSideBarCollapsed}
        />
        <SidebarLink
          href="/dashboard/products"
          icon={Clipboard}
          label="Products"
          isCollapsed={isSideBarCollapsed}
        />
        {/* <SidebarLink
          href="/dashboard/inventory"
          icon={Archive}
          label="Inventory"
          isCollapsed={isSideBarCollapsed}
        /> */}
         <SidebarLink
          href="/dashboard/sales"
          icon={CircleDollarSign}
          label="Sales"
          isCollapsed={isSideBarCollapsed}
        />
         <SidebarLink
          href="/dashboard/purchases"
          icon={ShoppingBag}
          label="Purchases"
          isCollapsed={isSideBarCollapsed}
        />
        {/* <SidebarLink
          href="/dashboard/users"
          icon={User}
          label="Users"
          isCollapsed={isSideBarCollapsed}
        /> */}
        <SidebarLink
          href="/dashboard/settings"
          icon={SlidersHorizontal}
          label="Settings"
          isCollapsed={isSideBarCollapsed}
        />
      </div>

      {/* FOOTER */}
      <div className={`${isSideBarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Sefstock
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
