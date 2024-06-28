import { useState } from 'react';
import Image from "next/image";

function NavBar({ userEmail, onSignOut }: { userEmail: string, onSignOut: () => void }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleSignOut = () => {
    onSignOut();
    setShowMenu(false);
  };

  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center ">
          <div className="flex items-center ">
            <Image
              className="h-8"
              src="/logo.svg"
              alt="To Do App"
              width={32}
              height={32}
              priority
            />
            <span className='ml-4 hidden md:block'>To Do List App</span>
          </div>
          <span className="cursor-pointer" onClick={handleMenuToggle}>
            {userEmail}
            {showMenu && (
              <div className="relative">
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
                  <button
                    onClick={handleSignOut}
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </span>
        </div>
      </nav>
    </header>
  );
}
export default NavBar;