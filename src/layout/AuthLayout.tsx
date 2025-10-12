// src/layouts/AuthLayout.jsx
import React, { type ReactNode } from "react";
import Logo from "@/components/Logo";
import constructionImage from "@/assets/construction.png";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div
      className="flex bg-white overflow-hidden m-4 rounded-2xl"
      style={{ height: "calc(100vh - 2rem)" }}
    >
      {/* Left Side - dynamic form content */}
      <div className="flex flex-col justify-between px-8 md:px-16 lg:px-24 w-full lg:w-1/2">
        {/* Top Logo */}
        <div className="pt-10">
          <Logo />
        </div>

        {/* Page content (SignIn / SignUp form) */}
        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
          {children}
        </div>

        {/* Bottom padding */}
        <div className="h-10" />
      </div>

      {/* Right Side - Full Image */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src={constructionImage}
          alt="Construction site"
          className="h-full w-full object-cover rounded-l-2xl"
        />
        <div className="absolute inset-0 bg-[#8A5BD5]/10 rounded-l-2xl" />
      </div>
    </div>
  );
};

export default AuthLayout;
