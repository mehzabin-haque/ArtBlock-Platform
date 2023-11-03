// pages/index.tsx
import React from 'react';
import DutchAuction from '../components/DutchAuction';
import Link from 'next/link';
import { IoArrowBackCircleSharp } from 'react-icons/io5';

const auctions = [
    {
        title: 'Auction 1',
        startingPrice: 10, // Starting price in ETH
        priceDecrement: 1, // Amount of price decrement in ETH
        endTime: new Date('2023-11-10T23:59:59').getTime(), // End time in milliseconds
        minPrice: 5, // Minimum price in ETH
    },
    {
        title: 'Auction 2',
        startingPrice: 15,
        priceDecrement: 2,
        endTime: new Date('2023-11-15T23:59:59').getTime(),
        minPrice: 8,
    },
    {
        title: 'Auction 3',
        startingPrice: 20,
        priceDecrement: 2,
        endTime: new Date('2023-11-20T23:59:59').getTime(),
        minPrice: 10,
    },
];

const Auction: React.FC = () => {
    return (
        <>
            <Link href='/'>
                <IoArrowBackCircleSharp className="h-10 w-10 text-black" aria-hidden="true" />
            </Link>

            <div className="container mx-auto py-8">
                <h1 className="text-center text-3xl font-extrabold text-gray-900 py-4">Dutch Auctions</h1>
                {auctions.map((auction, index) => (
                    <div key={index} className='flex items-center justify-center mb-8'>
                        <div className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border">
                            <div className="relative h-56 overflow-hidden rounded-t-xl">
                                <img
                                    src="/test.jpg"
                                    alt="Auction Item"
                                />
                            </div>
                            <div className="p-6">
                                <DutchAuction
                                    title={auction.title}
                                    startingPrice={auction.startingPrice}
                                    priceDecrement={auction.priceDecrement}
                                    endTime={auction.endTime}
                                    minPrice={auction.minPrice}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Auction;
