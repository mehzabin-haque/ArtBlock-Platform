import React, { useState } from 'react';
import Dropdown from './Dropdown';
import { useContractWrite, useWaitForTransaction, usePrepareContractWrite } from 'wagmi'
import { Greeter__factory } from '../../typechain'
import contractDetails from '../info/contractDetails.json'
import { IoArrowBackCircleSharp } from 'react-icons/io5'
import Link from 'next/link'

type Props = {}


const AddRemoveInput: React.FC = () => {
 const [inputType, setInputType] = useState('');
 const [isClick, setClick] = useState(false);

 const clicked = () => {
    setClick(!isClick);
 };


 const handleAdd = () => {
    setInputType('add');
 };

 const handleRemove = () => {
    setInputType('remove');
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
  
  function handleChange(evt) {
    console.log(evt.currentTarget.value)
    setCurrentValueEther(evt.currentTarget.value)
  }

 return (
    <div>
      <Dropdown title="Liquidity" items={[{ name: 'Add', action: handleAdd }, { name: 'Remove', action: handleRemove }]} />
      {inputType === 'add' && 
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
         Add Value
        </button>
      </form>}
      {inputType === 'remove' && 
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
       Remove Value
      </button>
    </form>}
    </div>
 );
};

export default AddRemoveInput;