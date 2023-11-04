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
      <p>Starting Price: {startingPrice} ABX</p>
      <p>Price Decrement: {priceDecrement} ABX</p>
      <Timer endTime={endTime} />
      <p>Min Price: {minPrice} ABX</p>
      {/* <MoneyRaised currentAmount={startingPrice} goalAmount={minPrice} /> */}
      <div className='flex justify-center items-center py-2'>
        {/* <Link href='sell'></Link> */}
      <button className="border-2 rounded-lg py-3 px-6 text-center font-bold bg-pink-500 text-white shadow-md hover:shadow-lg focus:opacity-85 active:opacity-85">
        Place Bid
      </button>
      </div>
      
    </div>
  );
};

export default DutchAuction;
