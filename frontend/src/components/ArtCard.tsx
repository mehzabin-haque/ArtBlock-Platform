// components/ArtCard.tsx
import React from 'react';

interface ArtCardProps {
  artName: string;
  artist: string;
  owner: string;
  price: string;
}

const ArtCard: React.FC<ArtCardProps> = ({ artName, artist, owner, price }) => {
  return (
    <div className="border border-gray-300 rounded p-4 mb-4">
      <h2 className="text-xl font-semibold">{artName}</h2>
      <p>Artist: {artist}</p>
      <p>Recent Owner: {owner}</p>
      <p>Price: {price}</p>
    </div>
  );
};

export default ArtCard;
