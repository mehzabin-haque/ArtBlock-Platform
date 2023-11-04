// pages/Community2.tsx
import React, { useState } from 'react';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import Link from 'next/link';
import AddRemoveInput from '../components/AddRemoveInput';
import CommunityCard from '../components/CommunityCard';

const communityData = [
  {
    title: 'Tired Community',
    description: 'SOOOOOOOOOOOOOOO.<br/> 1 Boo == 100 High Token',
  },
  {
    title: 'High Community',
    description: 'Community for High People. <br/> 1 High == 100 ABX Token',
  },
  {
    title: 'Tanaaaa Community',
    description: 'Community for Tanaaaa. <br/> 1 Tanaaaa == 10 ABX Token',
  },
  // Add more community data as needed
];

const Community2: React.FC = () => {
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
        <Link href="/communitySpecific">
        <div className="flex h-screen overflow-x-auto items-center justify-center">
          {communityData.map((community, index) => (
            <CommunityCard
              key={index}
              title={community.title}
              description={community.description}
            />
          ))}
        </div>
        </Link>
        
      </div>
    </>
  );
};

export default Community2;
