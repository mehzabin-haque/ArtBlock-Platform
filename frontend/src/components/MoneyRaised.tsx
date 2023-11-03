import React from 'react';

type Props = {
  currentAmount: number; // Current amount raised
  goalAmount: number; // Fundraising goal amount
};

const MoneyRaised: React.FC<Props> = ({ currentAmount, goalAmount }) => {
  const progress = (currentAmount / goalAmount) * 100;

  return (
    <div className="w-full">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              Fundraising Goal
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {currentAmount} ETH raised of {goalAmount} ETH
            </span>
          </div>
        </div>
        <div className="flex h-2 bg-gray-200 rounded-full">
          <div
            style={{ width: `${progress}%` }}
            className="flex h-2 bg-blue-500 rounded-full"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MoneyRaised;
