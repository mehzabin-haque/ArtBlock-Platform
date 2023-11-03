import React from 'react';
import { BiSolidUpArrowCircle, BiSolidDownArrowCircle } from 'react-icons/bi';
import { IoArrowBackCircleSharp } from 'react-icons/io5';

const demoVotingData = [
  {
    title: 'Cute Little Art',
    description: "Sold this item in 50 ETH and that's why in need of Upvote of yours.",
    upvotes: 100,
    downvotes: 20,
  },
  {
    title: 'Beautiful Landscape',
    description: 'A breathtaking landscape captured in this artwork. Show your support!',
    upvotes: 85,
    downvotes: 15,
  },
  {
    title: 'Abstract Artwork',
    description: 'This abstract piece leaves room for interpretation. What do you think?',
    upvotes: 75,
    downvotes: 10,
  },
];

const Voting = () => {
  return (
    <>
      <div className='h-screen flex items-center justify-center'>
        {demoVotingData.map((item, index) => (
          <div key={index} className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border m-4">
            <div className="relative h-56 mx-4 -mt-6 overflow-hidden text-white shadow-lg rounded-xl bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40">
              {/* You can add an image source here */}
              <img src="/test.jpg" alt="img-blur-shadow" />
            </div>
            <div className="p-6">
              <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                {item.title}
              </h5>
              <p className="block font-sans text-md antialiased font-normal leading-relaxed text-inherit">
                {item.description}
              </p>
            </div>
            <div className="p-6 pt-0 flex justify-between">
              <button
                className="border-solid border-2 w-2/5 border-black rounded-lg bg-pink-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                data-ripple-light="true"
              >
                Upvote <BiSolidUpArrowCircle className="h-5 w-5 text-black" aria-hidden="true" />{' '}
                {item.upvotes}
              </button>
              <button
                className="border-solid border-2 w-2/5 border-black rounded-lg bg-pink-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                data-ripple-light="true"
              >
                Downvote <BiSolidDownArrowCircle className="h-5 w-5 text-black" aria-hidden="true" />{' '}
                {item.downvotes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Voting;
