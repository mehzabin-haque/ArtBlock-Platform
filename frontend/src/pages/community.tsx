'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import { useContractWrite, useWaitForTransaction, usePrepareContractWrite, useContractRead } from 'wagmi'
import { ABXToken__factory, ArtBlockPlatform__factory, Greeter__factory } from '../../typechain'
import contractDetails from '../info/contractDetails.json'
import { IoArrowBackCircleSharp } from 'react-icons/io5'
import Link from 'next/link'
import { parseEther } from 'viem'
import { use } from 'chai'

type Props = {}
export default function Community(props: Props) {

    const [community, setCommunity] = useState({
        title: "",
        desc: "",
        tokenName: "",
        syntax:"",
      });
    
    //   const { address } = useAccount();
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCommunity({ ...community, [name]: value });
      };
    

  const [currentValueEther, setCurrentValueEther] = useState('')
  const [currentValueArtium, setCurrentValueArtium] = useState('')
  const [abxTokenAddress, setAbxTokenAddress] = useState('')
 
    const { data:token, isRefetching, refetch } = useContractRead({
      address: contractDetails.ABXContact as `0x${string}`,
      abi: ArtBlockPlatform__factory.abi,
      functionName: 'abxToken',
    });
     useEffect(() => {
      if (token) {
        setAbxTokenAddress(token);
      }
    }
    , [token]);
  
    const { config:approveConfig } = usePrepareContractWrite({
      address: abxTokenAddress ,
      abi: ABXToken__factory.abi,
      functionName: "approve",
      args: [contractDetails.ABXContact, 1000],
    });
  
    const {
      data: writeContractResult,
      writeAsync: approveAsync,
      error,
    } = useContractWrite(approveConfig);
  
    const { isLoading: isApproving } = useWaitForTransaction({
      hash: writeContractResult ? writeContractResult.hash : undefined,
      onSuccess(data) {
        refetch();
      },
    });
 
  const { config } = usePrepareContractWrite({
    address: contractDetails.ABXContact as `0x${string}`,
    abi: ArtBlockPlatform__factory.abi,
    functionName: 'createCommunity',
    args: [community.title,  community.tokenName, community.syntax,community.desc],
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  const { data: receipt, isLoading: isPending } = useWaitForTransaction({ hash: data?.hash })
  
//   function handleChange(evt) {
//     console.log(evt.currentTarget.value)
//     setCurrentValueEther(evt.currentTarget.value)
//   }
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(community);
        approveAsync();
        if(!error){
          write();
        }
       
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
        <div className="mb-4">
          <label
            htmlFor="syntax"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
          Syntax
          </label>
          <input
            type="text"
            id="syntax"
            name="syntax"
            value={community.syntax}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        
        <div className="text-center pt-4">
        <Link href='community2'>
        <button
          type="submit"
          className="rounded-lg   border-t border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
        >
            Submit
          </button>
        </Link>
        </div>
      </form>
      {isLoading && <div>Check wallet...</div>}
      {isPending && <div>Transaction pending...</div>}
      {isSuccess && (
        <>
          <div>Transaction Hash: {data?.hash}</div>
          <div>
            Transaction Link: <a target="_blank" href={"https://sepolia.etherscan.io/tx/"+data?.hash}>Link</a>
          </div>
        </>
      )}
      </div>
    </>
  );
}

// export default Community