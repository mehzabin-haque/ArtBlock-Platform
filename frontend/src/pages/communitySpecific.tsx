'use client'
import React, { useState } from 'react';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import Link from 'next/link';
import AddRemoveInput from '../components/AddRemoveInput';
import CommunityCard from '../components/CommunityCard';
import Converter from 'components/Convert';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import contractDetails from '../info/contractDetails.json'
import { DEX__factory } from '../../typechain';

export default function CommunitySpecific() {
  const [currentValueEther, setCurrentValueEther] = useState('');
  const [currentValueArtium, setCurrentValueArtium] = useState('');

  function handleChange(evt) {
    console.log(evt.currentTarget.value);
    setCurrentValueEther(evt.currentTarget.value);
  }

  const { config } = usePrepareContractWrite({
    address: contractDetails.DEX as `0x${string}`,
    abi: DEX__factory.abi,
    functionName: 'abxToCom',
    args: [100]
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  const { data: receipt, isLoading: isPending } = useWaitForTransaction({ hash: data?.hash })
  
  return (
    <>
      <div>
        <Link href="/">
          <IoArrowBackCircleSharp className="h-10 w-10 text-black" aria-hidden="true" />
        </Link>
        
        <div className="text-center py-10">
          <h2 className="text-3xl font-extrabold text-gray-900">Tired Community</h2>
          <p className="mt-4 text-lg text-gray-500">SOOOOOOOOOOOOOOO TIRED</p>
        </div>

        <form
          className="m-2 flex items-center justify-center py-6"
          onSubmit={e => {
            e.preventDefault()
            write()
          }}
        >
          
          <button
            type="submit"
            className="rounded-lg border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
          >
            Swap 100 ABX with SAD
          </button>
        </form>

        <form
          className="m-4 flex items-center justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            // Handle form submission
          }}
        >
          
          <button
            type="submit"
            className="rounded-lg  border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
          >
            Swap 1000 SAD with ABX
          </button>
        </form>
        <Link href="/publishArt">
        <button
            type="submit"
            className="rounded-lg flex items-center justify-center border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
          >
           Publish a Art
          </button>
          </Link>
        <div>
          <AddRemoveInput />
        </div>

        
      </div>
    </>
  );
};

