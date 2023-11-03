// components/DutchAuction.tsx
import React from 'react';
import MoneyRaised from './MoneyRaised';
import Timer from './Timer';

interface DutchAuctionProps {
  title: string;
  startingPrice: number;
  priceDecrement: number;
  endTime: number;
  minPrice: number;
}

const DutchAuction: React.FC<DutchAuctionProps> = ({
  title,
  startingPrice,
  priceDecrement,
  endTime,
  minPrice,
}) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-8">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p>Starting Price: {startingPrice} ETH</p>
      <p>Price Decrement: {priceDecrement} ETH</p>
      <Timer endTime={endTime} />
      <p>Min Price: {minPrice} ETH</p>
      {/* <MoneyRaised currentAmount={startingPrice} goalAmount={minPrice} /> */}
      <div className='flex justify-center items-center py-2'>
      <button className="border-2 rounded-lg py-3 px-6 text-center font-bold bg-pink-500 text-white shadow-md hover:shadow-lg focus:opacity-85 active:opacity-85">
        Get Result
      </button>
      </div>
      
    </div>
  );
};

export default DutchAuction;
