'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import { useContractWrite, useWaitForTransaction, usePrepareContractWrite, useContractRead } from 'wagmi'
import { ABXToken__factory, ArtBlockPlatform__factory, CommunityToken__factory, Community__factory, Greeter__factory } from '../../typechain'
import contractDetails from '../info/contractDetails.json'
import { IoArrowBackCircleSharp } from 'react-icons/io5'
import Link from 'next/link'
import { parseEther } from 'viem'
import { use } from 'chai'

type Props = {}
export default function Sell(props: Props) {

    const [community, setCommunity] = useState({
        artName: "",
        setPrice: 0,
        royalty: 0,
    });

    //   const { address } = useAccount();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCommunity({ ...community, [name]: value });
    };


    const [currentValueEther, setCurrentValueEther] = useState('')
    const [currentValueArtium, setCurrentValueArtium] = useState('')
    const [abxTokenAddress, setAbxTokenAddress] = useState('')


    const { config: approveConfig } = usePrepareContractWrite({
        address: "0xf8E280a570201C8530cD975E2Cd00565456ce398",
        abi: CommunityToken__factory.abi,
        functionName: "approve",
        args: [contractDetails.Community, 100],
    });

    const {
        data: writeContractResult,
        writeAsync: approveAsync,
        error,
    } = useContractWrite(approveConfig);

    const { isLoading: isApproving } = useWaitForTransaction({
        hash: writeContractResult ? writeContractResult.hash : undefined,
       
    });

    const { config } = usePrepareContractWrite({
        address: contractDetails.Community as `0x${string}`,
        abi: Community__factory.abi,
        functionName: 'createSellPost',
        args: [community.artName, community.setPrice, community.royalty], 
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
        await approveAsync();
        if (!error) {
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
                            htmlFor="artName"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Art Name
                        </label>
                        <input
                            type="text"
                            id="artName"
                            name="artName"
                            value={community.artName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="royalty"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Royalty
                        </label>
                        <input
                            type="number"
                            id="royalty"
                            name="royalty"
                            value={community.royalty}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
                        />
                    </div>

                

                    <div className="text-center pt-4">
                        {/* <Link href='community2'> */}
                        <button
                            type="submit"
                            className="rounded-lg   border-t border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
                        >
                            Submit
                        </button>
                        {/* </Link> */}
                    </div>
                </form>
                {isLoading && <div>Check wallet...</div>}
                {isPending && <div>Transaction pending...</div>}
                {isSuccess && (
                    <>
                        <div>Transaction Hash: {data?.hash}</div>
                        <div>
                            Transaction Link: <a target="_blank" href={"https://sepolia.etherscan.io/tx/" + data?.hash}>Link</a>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

// export default Community