import React, { useState } from 'react';

interface DropdownProps {
 title: string;
 items: { name: string; action: () => void }[];
}

const Dropdown: React.FC<DropdownProps> = ({ title, items }) => {
 const [isOpen, setIsOpen] = useState(false);
 const [isClick, setClick] = useState(false);

 const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setClick(!isClick);
 };



 return (
    <div className="relative text-left flex items-center justify-center">
      <button
        className="text-center rounded-lg  border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
        type="button"
        onClick={toggleDropdown}
      >
        {title}
      </button>
      {isOpen && (
        <div className="flex items-center justify-center bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={item.action}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
 );
};

export default Dropdown;