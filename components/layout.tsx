import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: NextPage<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-row bg-yellow-100 justify-between h-screen text-sm">
      <div></div>
      <div className="max-w-3xl bg-gray-300 w-full h-full flex flex-col justify-between">
        <div className="h-20">header</div>
        <div className="h-full border overflow-auto">
          <div className={`p-2 sm:p-5 bg-white space-y-2`}>{children}</div>
        </div>
        <div className="h-20 flex flex-row justify-between">
          <Link href={'/'}>
            <div className="text-center w-1/3 pt-[1.5rem] hover:bg-gray-200 cursor-pointer">
              Home
            </div>
          </Link>
          <Link href={'/'}>
            <div className="text-center w-1/3 pt-[1.5rem] hover:bg-gray-200 cursor-pointer">
              Server
            </div>
          </Link>
          <Link href={'/analytics'}>
            <div className="text-center w-1/3 pt-[1.5rem] hover:bg-gray-200 cursor-pointer">
              Etc
            </div>
          </Link>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Layout;
