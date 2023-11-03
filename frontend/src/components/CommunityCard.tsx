// components/CommunityCard.tsx
import React from 'react';

interface CommunityCardProps {
  title: string;
  description: string;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ title, description }) => {
  return (
    <div className="max-w-sm mx-4 bg-white border rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div>
  
  <p dangerouslySetInnerHTML={{ __html: description }}></p>
</div>

    </div>
  );
};

export default CommunityCard;
