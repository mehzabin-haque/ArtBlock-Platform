import { useState } from 'react';

const Converter = () => {
 const [ether, setether] = useState(1);
 const [abx, setabx] = useState(10000);

 const convert = (value: number, to: string) => {
    const conversionRate = 10000; // ether to abx conversion rate
    const result = to === 'ether' ? value / conversionRate : value * conversionRate;
    return result;
   };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>, to: string) => {
        const value = parseFloat(e.target.value);
        if (to === 'ether') {
            setether(value);
            setabx(convert(value, 'abx'));
        } else {
            setabx(value);
            setether(convert(value, 'ether'));
        }
 };

 return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-3xl mb-4">Currency Converter</h1>
      <div className="flex justify-between w-full max-w-md mb-4">
        <div className="w-full">
          <label htmlFor="ether" className="block mb-2">
            Ether
          </label>
          <input
            id="ether"
            type="number"
            className="border p-2 w-full"
            value={ether}
            onChange={(e) => handleChange(e, 'ether')}
          />
        </div>
        <div className="w-full">
          <label htmlFor="abx" className="block mb-2">
            ABX
          </label>
          <input
            id="abx"
            type="number"
            className="border p-2 w-full"
            value={abx}
            onChange={(e) => handleChange(e, 'abx')}
          />
        </div>
      </div>
    </div>
 );
};

export default Converter;