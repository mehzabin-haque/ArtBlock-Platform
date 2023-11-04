import { useState } from 'react';

const Converter = () => {
  const [boo, setBoo] = useState(10000);
  const [abx, setAbx] = useState(1);

  const convert = (value, to) => {
    const conversionRate = 10000; // boo to abx conversion rate
    return to === 'boo' ? value / conversionRate : value * conversionRate;
  };

  const handleChange = (e, to) => {
    const value = parseFloat(e.target.value);
    if (to === 'boo') {
      setBoo(value);
      setAbx(convert(value, 'abx'));
    } else {
      setAbx(value);
      setBoo(convert(value, 'boo'));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-4">Token Converter</h1>
      <div className="bg-gray-50 shadow-md p-4 rounded-md max-w-md">
        <div className="flex justify-between mb-4">
          <div className="w-1/2">
            <label htmlFor="abx" className="block mb-2 font-semibold text-gray-700">
              ABX
            </label>
            <input
              id="abx"
              type="number"
              className="border p-2 w-full rounded-md"
              value={abx}
              onChange={(e) => handleChange(e, 'abx')}
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="boo" className="block mb-2 font-semibold text-gray-700">
              Boo
            </label>
            <input
              id="boo"
              type="number"
              className="border p-2 w-full rounded-md"
              value={boo}
              onChange={(e) => handleChange(e, 'boo')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
