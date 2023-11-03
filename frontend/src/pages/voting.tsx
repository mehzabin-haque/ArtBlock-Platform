import Link from 'next/link'
import React from 'react'
import { BiSolidUpArrowCircle, BiSolidDownArrowCircle } from 'react-icons/bi'
import { IoArrowBackCircleSharp } from 'react-icons/io5'

type Props = {}

const Voting = (props: Props) => {
    return (
        <>
            <Link href='/'>
                <IoArrowBackCircleSharp className="h-10 w-10 text-black" aria-hidden="true" />
            </Link>
            <div className='h-screen flex items-center justify-center'>
                <div className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border">
                    <div className="relative h-56 mx-4 -mt-6 overflow-hidden text-white shadow-lg rounded-xl bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40">
                        <img
                            src="/test.jpg"
                            alt="img-blur-shadow"
                        />
                    </div>
                    <div className="p-6">
                        <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                            Cute little Art
                        </h5>
                        <p className="block font-sans text-md antialiased font-normal leading-relaxed text-inherit">
                            Sold this item in 50 ETH and that's why in need of Upvote of yours.
                        </p>
                    </div>
                    <div className="p-6 pt-0 flex justify-between">
                        <button
                            className=" border-solid border-2 w-2/5 border-black rounded-lg bg-pink-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            data-ripple-light="true"
                        >
                            Upvote <BiSolidUpArrowCircle className="h-5 w-5 text-black" aria-hidden="true" />
                        </button>
                        {/* <div className="my-2"></div> */}
                        <button
                            className="border-solid border-2 w-2/5 border-black rounded-lg bg-pink-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            data-ripple-light="true"
                        >
                            Downvote <BiSolidDownArrowCircle className="h-5 w-5 text-black" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Voting