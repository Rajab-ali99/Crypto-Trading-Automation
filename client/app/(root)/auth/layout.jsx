import Image from 'next/image'
import React from 'react'
import logo from "@/public/assets/logo.png";
import { Navbar } from '@/components/auth/navbar';

const layout = ({ children }) => {
  return (
    <div>
        <Navbar/>
      {children}
    </div>
  )
}

export default layout
