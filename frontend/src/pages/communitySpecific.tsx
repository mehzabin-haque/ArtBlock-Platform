// pages/Community2.tsx
import React, { useState } from 'react';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import Link from 'next/link';
import AddRemoveInput from '../components/AddRemoveInput';
import CommunityCard from '../components/CommunityCard';
import Converter from 'components/Convert';


const CommunitySpecific: React.FC = () => {
  const [currentValueEther, setCurrentValueEther] = useState('');
  const [currentValueArtium, setCurrentValueArtium] = useState('');

  function handleChange(evt) {
    console.log(evt.currentTarget.value);
    setCurrentValueEther(evt.currentTarget.value);
  }

  return (
    <>
      <div>
        <Link href="/">
          <IoArrowBackCircleSharp className="h-10 w-10 text-black" aria-hidden="true" />
        </Link>
        
        <div className="text-center py-10">
          <h2 className="text-3xl font-extrabold text-gray-900">Boo Community</h2>
          <p className="mt-4 text-lg text-gray-500">Description of the Community</p>
        </div>

        <div className='flex items-center justify-center'>
            <Converter />
        </div>

        <form
          className="m-2 flex items-center justify-center py-6"
          onSubmit={(e) => {
            e.preventDefault();
            // Handle form submission
          }}
        >
          <input
            value={currentValueEther}
            onChange={(evt) => handleChange(evt)}
            className="mr-0 rounded-l-lg border-b border-l border-t border-gray-200 bg-white p-4 text-gray-800"
            placeholder="Enter BooToken Value "
          />
          <button
            type="submit"
            className="rounded-r-lg border-b border-r border-t border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
          >
            Exchange Value
          </button>
        </form>

        <form
          className="m-4 flex items-center justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            // Handle form submission
          }}
        >
          <input
            value={currentValueArtium}
            onChange={(evt) => handleChange(evt)}
            className="mr-0 rounded-l-lg border-b border-l border-t border-gray-200 bg-white p-4 text-gray-800"
            placeholder="Enter ABX Value "
          />
          <button
            type="submit"
            className="rounded-r-lg border-b border-r border-t border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
          >
            Exchange Value
          </button>
        </form>

        <div>
          <AddRemoveInput />
        </div>

        
      </div>
    </>
  );
};

export default CommunitySpecific;
