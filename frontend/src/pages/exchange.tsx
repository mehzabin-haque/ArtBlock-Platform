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
    <Link href='/'>
    <IoArrowBackCircleSharp className="h-10 w-10 text-black" aria-hidden="true" />
    </Link>
    <Converter />
      <form
        className="m-4 flex items-center justify-center py-40"
        onSubmit={e => {
          e.preventDefault()
          write()
        }}
      >
        <input
          value={currentValueEther}
          onChange={evt => handleChange(evt)}
          className="mr-0 rounded-l-lg border-b border-l border-t border-gray-200 bg-white p-4 text-gray-800"
          placeholder="Enter Ethereum Value "
        />
        <button
          type="submit"
          className="rounded-r-lg border-b border-r  border-t border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
        >
          Exchange Value
        </button>
      </form>

      <form
        className="m-4 flex items-center justify-center "
        onSubmit={e => {
          e.preventDefault()
          write()
        }}
      >
        <input
          value={currentValueArtium}
          onChange={evt => handleChange(evt)}
          className="mr-0 rounded-l-lg border-b border-l border-t border-gray-200 bg-white p-4 text-gray-800"
          placeholder="Enter Artium Value "
        />
        <button
          type="submit"
          className="rounded-r-lg border-b border-r  border-t border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
        >
         Exchange Value
        </button>
      </form>

    </>
  )
}

export default Exchange