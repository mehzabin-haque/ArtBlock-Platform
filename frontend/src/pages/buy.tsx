import React, { useState } from 'react'
import { useContractWrite, useWaitForTransaction, usePrepareContractWrite } from 'wagmi'
import { Greeter__factory } from '../../typechain'
import contractDetails from '../info/contractDetails.json'
import { IoArrowBackCircleSharp } from 'react-icons/io5'
import Link from 'next/link'
import Converter from '../components/Convert'

type Props = {}
const Exchange = (props: Props) => {

  const [currentValueEther, setCurrentValueEther] = useState('')
  const [currentValueArtium, setCurrentValueArtium] = useState('')

  const { config } = usePrepareContractWrite({
    address: contractDetails.contractAddress as `0x${string}`,
    abi: Greeter__factory.abi,
    functionName: 'setGreeting',
    args: [currentValueEther],
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  const { data: receipt, isLoading: isPending } = useWaitForTransaction({ hash: data?.hash })
  
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
    <Converter />
    <div className='flex items-center justify-center'>
    <button
          type="submit"
          className="rounded-lg flex items-center justify-center border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
        >
         Buy ABX
        </button>

        </div>
    {/* </div> */}
    </>
  )
}

export default Exchange