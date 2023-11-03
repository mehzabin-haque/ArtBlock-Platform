import React, { useState } from 'react'
import { useContractWrite, useWaitForTransaction, usePrepareContractWrite } from 'wagmi'
import { ArtBlockPlatform__factory, Greeter__factory } from '../../typechain'
import contractDetails from '../info/contractDetails.json'
import { IoArrowBackCircleSharp } from 'react-icons/io5'
import Link from 'next/link'
import Converter from '../components/Convert'
import { parseEther } from 'viem'
import ConnectWallet from 'components/Connect/ConnectWallet'
import { utils } from 'ethers'

type Props = {}
const Exchange = (props: Props) => {

  const [currentValueEther, setCurrentValueEther] = useState('')
  const [currentValueABX, setCurrentValueABX] = useState('')

  const { config } = usePrepareContractWrite({
    address: contractDetails.ABXTokencontractAddress as `0x${string}`,
    abi: ArtBlockPlatform__factory.abi,
    functionName: 'purchaseABX',
    args: [],
    value: parseEther(currentValueEther)
  })

  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  const { data: receipt, isLoading: isPending } = useWaitForTransaction({ hash: data?.hash })
  
  async function  handleSubmit(e) {
    e.preventDefault();
    console.log('submit')
    // write()
  }

  function handleChange(evt) {
    console.log(evt.currentTarget.value)
    setCurrentValueEther(evt.currentTarget.value)
  }

  return (
    <>
      <Link href='/milestone1'>
        <IoArrowBackCircleSharp className="h-10 w-10 text-black" aria-hidden="true" />
      </Link>
      {/* <div className='flex items-center justify-center'> */}
      <div>
        <h4 className="text-center text-sm font-medium">demo: ConnectWalletBtn Full</h4>
        <div className="flex w-full flex-col items-center">
          <ConnectWallet />
        </div>
      </div>      <Converter />
      <div className='flex items-center justify-center'>
        
          <button
            onClick={write}
            onClickCapture={handleSubmit}
            className="rounded-lg flex items-center justify-center border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
          >
            Buy ABX
          </button>
        {isLoading && (
          <p className="text-green-500">Success! {currentValueABX} {' '} ABX Token bought</p>
        )}

      </div>
      {/* </div> */}
    </>
  )
}

export default Exchange