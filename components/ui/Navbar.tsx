"use client"

// ** Imports (client component) ** \\
import Image from "next/image";
import React from "react";


// ** Component ** \\
const Navbar = (): React.ReactElement => {
 
  return (
    <nav
      className="flex items-center justify-between p-4 border-b border-black"
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/icon-light-themed.png"
          alt="logo_icon"
          width={55}
          height={55}
          unoptimized
        />

        <h6 className="font-normal text-xl md:text-2xl">Authentication demo</h6>
      </div>
    </nav>
  );
};

// ** Component export ** \\
export default Navbar;