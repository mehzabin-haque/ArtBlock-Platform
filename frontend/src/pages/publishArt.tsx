import React, { FormEvent, useState } from 'react'
import { useContractWrite, useWaitForTransaction, usePrepareContractWrite } from 'wagmi'
import { Greeter__factory } from '../../typechain'
import contractDetails from '../info/contractDetails.json'
import { IoArrowBackCircleSharp } from 'react-icons/io5'
import Link from 'next/link'
import Timer from 'components/Timer'

type Props = {}
const Publish = (props: Props) => {

    const [publish, setpublish] = useState({
        artName: "",
        startPrice: 0,
        price_decrement: 0,
        min_price: 0,
        timing: 0,
      });
      
    
    //   const { address } = useAccount();
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setpublish({ ...publish, [name]: value });
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
            value={publish.artName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        {/* set the starting price, price decrement, timing of price reduction, and minimum price. */}

        <div className="mb-4">
          <label
            htmlFor="startPrice"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Starting Price
          </label>
          <input
            type="number"
            id="startPrice"
            name="startPrice"
            value={publish.startPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="min_price"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Minimum Price
          </label>
          <input
            type="number"
            id="min_price"
            name="min_price"
            value={publish.min_price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="price_decrement"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Price Decrement
          </label>
          <input
            type="number"
            id="price_decrement"
            name="price_decrement"
            value={publish.price_decrement}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
          />
        </div>

        <div className="mb-4">
            <label
                htmlFor="timing"
                className="block text-gray-700 text-sm font-bold mb-2"
            >
                Timing (in mins)
            </label>
            <input
                type="number"
                id="timing"
                name="timing"
                value={publish.timing}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
            />
        </div>
        {/* <Timer endTime={new Date('2023-11-05T23:59:59').getTime()} /> */}

        
        <div className="text-center pt-4">
        <button
          type="submit"
          className="rounded-lg  border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
        >
            Submit
          </button>
        </div>
      </form>
      </div>
    </>
  );
}

export default Publish