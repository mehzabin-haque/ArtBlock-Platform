import React, { useState } from 'react'
import { useContractWrite, useWaitForTransaction, usePrepareContractWrite } from 'wagmi'
import { ArtBlockPlatform__factory, Greeter__factory } from '../../typechain'
import contractDetails from '../info/contractDetails.json'
import { IoArrowBackCircleSharp } from 'react-icons/io5'
import Link from 'next/link'
import Converter from '../components/Convert'
import ConnectWallet from 'components/Connect/ConnectWallet'
import Buy from './Buy'

type Props = {}
const Landing = (props: Props) => {

  const [currentValueEther, setCurrentValueEther] = useState('')
  const [currentValueArtium, setCurrentValueArtium] = useState('')
  
  function handleChange(evt) {
    console.log(evt.currentTarget.value)
    setCurrentValueEther(evt.currentTarget.value)
  }

  const [firstTime, setFirstTime] = useState(false);
  const [alreadyUser, setAlreadyUser] = useState(false);

  return (
    <>
    <div className='bg-gray-100'>
        <h4 className=" text-center text-sm font-medium">demo: ConnectWalletBtn Full</h4>
        <div className="flex w-full flex-col items-center">
          <ConnectWallet />
        </div>
      </div>
    
     <div className=" flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
     
 <div className="max-w-md w-full space-y-8">
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        ArtBlock
      </h2>
    </div>

    <Buy />
        <Link href='/community'>
        <button
          type="submit"
          className="rounded-lg m-4 justify-center items-center flex flex-col spacy-y-16 border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
        >
         Create Community
        </button>
        </Link>
 </div>
</div>
    </>
   
  );
}

export default Landing;