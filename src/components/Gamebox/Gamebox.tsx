import Image from "next/image";
import React from "react";

const Gamebox = () => {
  return (
    <div className="mt-10 flex justify-between md:px-10 w-full flex-wrap space-y-4">
      <div className="flex flex-col items-center space-y-3 w-1/4 min-w-3xs">
        <p className="font-semibold text-gray-600">Flip a coin</p>
        <button className="bg-green-700 rounded-[0.75rem] p-2 aspect-[3/4] w-full">
          <div className="bg-green-500 rounded-[0.5rem] p-2 flex justify-center items-center w-full h-full">
            <Image src="/dollar.png" alt="dollar" width={100} height={100} />
          </div>
        </button>
      </div>
      <div className="flex flex-col items-center space-y-3 w-1/4 min-w-3xs">
        <p className="font-semibold text-gray-600">Whack a mole</p>
        <button className="bg-gray-700 rounded-[0.75rem] p-2 aspect-[3/4] w-full" disabled>
          <div className="bg-gray-500 rounded-[0.5rem] p-2 flex justify-center items-center w-full h-full">
            <Image src="/game.svg" alt="game" width={100} height={100} />
          </div>
        </button>
      </div>
      <div className="flex flex-col items-center space-y-3 w-1/4 min-w-3xs">
        <p className="font-semibold text-gray-600">Dice Prediction</p>
        <button className="bg-gray-700 rounded-[0.75rem] p-2 aspect-[3/4] w-full" disabled>
          <div className="bg-gray-500 rounded-[0.5rem] p-2 flex justify-center items-center w-full h-full">
            <Image src="/game.svg" alt="game" width={100} height={100} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Gamebox;
