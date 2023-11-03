import React, { useState } from 'react';
import ArtData from 'components/ArtData';

type Props = {};

const Marketplace = (props: Props) => {
  const [showArtData, setShowArtData] = useState(false);
  const info = () => {
    setShowArtData(!showArtData);
  }

  return (
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Marketplace</h2>
      <div className="flex items-center justify-center py-10">
        <button className="flex items-center justify-center rounded-lg border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800">
          Upload your ArtWork
        </button>
      </div>

      <div className="flex items-center justify-center py-10">
        <button className="flex items-center justify-center rounded-lg border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800">
          Buy ArtWork
        </button>
      </div>

      <div className="flex items-center justify-center py-10">
        <button
          onClick={info} // Set showArtData to true on button click
          className="flex items-center justify-center rounded-lg border-yellow-500 bg-yellow-400 p-4 px-8 font-bold uppercase text-gray-800"
        >
          All info of ArtWork
        </button>
      </div>

      {showArtData && <ArtData />} {/* Conditionally render ArtData when showArtData is true */}
    </div>
  );
};

export default Marketplace;
