"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import logo from "@/public/assets/logo.png";
import { WEBSITE_LOGIN , WEBSITE_HOME } from "@/routes/WebsiteRoutes";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";


export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
         <Image
          src={logo}
          alt="Bullish Pixel"
          width={logo.width}
          height={logo.height}
          className=" w-28"
        />


        <div className=" items-center gap-3 flex">
         <Link href={WEBSITE_HOME}>
            <IoMdArrowRoundBack className="text-3xl cursor-pointer mr-5"/>
         </Link>
          <ThemeToggle />
          <a href={WEBSITE_LOGIN} className="text-sm font-medium text-muted transition-colors hover:text-ink">
            Log in
          </a>

        </div>

      
      </div>

    </header>
  );
}
