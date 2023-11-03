// pages/index.tsx
import React, { useState } from 'react';
import ArtCard from '../components/ArtCard';

interface ArtData {
  artName: string;
  artist: string;
  owner: string;
  price: string;
}

const Home: React.FC = () => {
  const [showArtData, setShowArtData] = useState(false);

  // Sample art data
  const artData: ArtData[] = [
    {
      artName: 'Art 1',
      artist: 'Artist 1',
      owner: 'Owner 1',
      price: '$1000',
    },
    {
      artName: 'Art 2',
      artist: 'Artist 2',
      owner: 'Owner 2',
      price: '$1500',
    },
  ];

  return (
    <div className="flex flex-col items-center">
      
        <div>
          {artData.map((art, index) => (
            <ArtCard
              key={index}
              artName={art.artName}
              artist={art.artist}
              owner={art.owner}
              price={art.price}
            />
          ))}
        </div>
      
    </div>
  );
};

export default Home;
