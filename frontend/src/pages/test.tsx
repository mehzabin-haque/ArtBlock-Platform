import React, { FormEvent, useState } from 'react'
import { useContractWrite, useWaitForTransaction, usePrepareContractWrite, useContractRead } from 'wagmi'
import { CommunityToken__factory, Community__factory, Greeter__factory } from '../../typechain'
import contractDetails from '../info/contractDetails.json'
import { IoArrowBackCircleSharp } from 'react-icons/io5'
import Link from 'next/link'
import Timer from 'components/Timer'

type Props = {}
const Publish = (props: Props) => {

    const [proposal, setProposal] = useState({
        artName: "",
        exclusive_art: false,
    });


    //   const { address } = useAccount();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setProposal({ ...proposal, [name]: newValue });
    };


    const [currentValueEther, setCurrentValueEther] = useState('')
    const [currentValueArtium, setCurrentValueArtium] = useState('')

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
        functionName: 'proposeArt',
        args: [proposal.artName, proposal.exclusive_art],
    })
    const { data, isLoading, isSuccess, write } = useContractWrite(config)

    const { data: receipt, isLoading: isPending } = useWaitForTransaction({ hash: data?.hash })

    //   function handleChange(evt) {
    //     console.log(evt.currentTarget.value)
    //     setCurrentValueEther(evt.currentTarget.value)
    //   }
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await approveAsync();
        if (!error) {
            await write();
        }

    }

    return (
        <>
            <div className='h-screen flex items-center justify-center bg-gray-100'>
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
                            value={proposal.artName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="exclusive_art"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Exclusive Art
                        </label>
                        <input
                            type="checkbox"
                            id="exclusive_art"
                            name="exclusive_art"
                            checked={proposal.exclusive_art}
                            onChange={handleChange}
                            className="w-6 h-6 text-yellow-500"
                        />
                    </div>

                    <div className="text-center pt-4">
                        <button
                            type="submit"
                            className="rounded-lg border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
                        >
                            Submit
                        </button>
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

export default Publish