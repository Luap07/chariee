import React from 'react'
import { FaRobot, FaRegUserCircle  } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="w-full "> 
      <div className="flex items-center justify-between h-[100px] px-6 md:px-[150px]">
        
        {/* Logo Container */}
        <div className="logo gap-1.5 flex items-center text-3xl text-white">
          <FaRobot />
          <div className='text-xl font-semibold tracking-wide'>Chariee.<span className="text-blue-500">ai</span></div>
        </div>
        <div className="user text-3xl cursor-pointer text-white">
            <FaRegUserCircle  />
        </div>
        {/* You can add links or other nav items here later */}

      </div>
    </nav>
  )
}

export default Navbar