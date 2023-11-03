import React, { FormEvent, useState } from 'react'
import { useContractWrite, useWaitForTransaction, usePrepareContractWrite } from 'wagmi'
import { Greeter__factory } from '../../typechain'
import contractDetails from '../info/contractDetails.json'
import { IoArrowBackCircleSharp } from 'react-icons/io5'
import Link from 'next/link'

type Props = {}
const Community = (props: Props) => {

    const [community, setCommunity] = useState({
        title: "",
        desc: "",
        tokenName: "",
        
      });
    
    //   const { address } = useAccount();
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCommunity({ ...community, [name]: value });
      };
    

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
  
//   function handleChange(evt) {
//     console.log(evt.currentTarget.value)
//     setCurrentValueEther(evt.currentTarget.value)
//   }
    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        throw new Error('Function not implemented.')
    }

  return (
    <>
      <div className='h-screen py-40 bg-gray-100'>
      <form
        onSubmit={handleSubmit}
        className="w-2/5 mx-auto p-6 bg-white shadow-md rounded-lg"
      >
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
           Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={community.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="desc"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Community Description
          </label>
          <input
            type="text"
            id="desc"
            name="desc"
            value={community.desc}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="tokenName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Token Name
          </label>
          <input
            type="text"
            id="tokenName"
            name="tokenName"
            value={community.tokenName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        
        
        <div className="text-center pt-4">
        <button
          type="submit"
          className="rounded-lg   border-t border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
        >
            Submit
          </button>
        </div>
      </form>
      </div>
    </>
  );
}

export default Community