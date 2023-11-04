import React, { FormEvent, useEffect, useState } from 'react';
import { useContractWrite, useWaitForTransaction, usePrepareContractWrite } from 'wagmi';
import { Community__factory, Greeter__factory } from '../../typechain';
import contractDetails from '../info/contractDetails.json';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import Link from 'next/link';
import Timer from 'components/Timer';
import StorageClient from 'utils/StorageClient';
import { useRouter } from 'next/router';

type Props = {};

const Publish = (props: Props) => {
  const [fileContent, setFileContent] = useState('');
  const [data, setData] = useState<ArrayBuffer | string | null | undefined>(null);
  const [err, setErr] = useState<string | boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const selectedFile = file;

  useEffect(() => {
    // Fetch the file content from the API route
    fetch('/api/file')
      .then((response) => response.json())
      .then((data) => {
        setFileContent(data.content);
      })
      .catch((error) => {
        console.error('Error fetching file content', error);
      });
  }, []);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size / 1024 / 1024 > 2) {
        setErr('File size exceeded the limit of 2MB');
        setFile(null);
      } else {
        setErr(false);
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          setData(loadEvt.target?.result);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const uploadImage = async () => {
    if (file) {
      const imageURI = await new StorageClient().storeFiles(selectedFile);
      router.push(`/result?url=${imageURI}`);
    }
  };

  const [publish, setPublish] = useState({
    artName: '',
    startPrice: 0,
    price_decrement: 0,
    min_price: 0,
    timing: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPublish({ ...publish, [name]: value });
  };

  const [currentValueEther, setCurrentValueEther] = useState('');
  const [currentValueArtium, setCurrentValueArtium] = useState('');

  const { config } = usePrepareContractWrite({
    address: "0x9B223F8f9D9e00947298dcEc28e4d7d71D91dc11",
    abi: Community__factory.abi,
    functionName: 'createDutchAuction',
    args: [publish.artName, publish.startPrice, publish.price_decrement, publish.min_price, publish.timing],
  });
  const { data: chainData, isLoading, isSuccess, write } = useContractWrite(config);

  const { data: receipt, isLoading: isPending } = useWaitForTransaction({ hash: chainData?.hash });

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    uploadImage();
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-2/5 mx-auto p-6 bg-white shadow-md rounded-lg">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="mb-4"
          />
          {data !== null && <img src={data?.toString()} alt="Selected" className="mb-4" />}
          {err && <p>{err}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="artName" className="block text-gray-700 text-sm font-bold mb-2">
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
          <label htmlFor="startPrice" className="block text-gray-700 text-sm font-bold mb-2">
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
          <label htmlFor="min_price" className="block text-gray-700 text-sm font-bold mb-2">
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
          <label htmlFor="price_decrement" className="block text-gray-700 text-sm font-bold mb-2">
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
          <label htmlFor="timing" className="block text-gray-700 text-sm font-bold mb-2">
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
        {/* <Link href="/voting"> */}
          <div className="text-center pt-4">
            <button onClick={uploadImage}
              type="submit"
              className="rounded-lg border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
            >
              Submit
            </button>
          </div>
        {/* </Link> */}
      </form>
    </div>
  );
};

export default Publish;
