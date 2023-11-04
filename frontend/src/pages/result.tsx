import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import { FaClone } from 'react-icons/fa'
import { useState } from 'react'

const Result: NextPage = () => {
    const router = useRouter();
    const result = router.query;
    const url = `https://bafybeihabduj5qzi2nsnb6v7dnozbqqzvzawrikk4yj5q3qotumyme37aq.ipfs.dweb.link/test.jpg`;
    const [popover, setPopover] = useState<boolean>(false);
    const copyClipboard = () => {
        window.navigator.clipboard.writeText(url);
        setPopover(true);
        setTimeout(() => {
            setPopover(false)
        }, 5000);
    }
    return (
        <div className='h-screen flex items-center justify-center'>
            <img src={url} />
        </div>
    )
}
export default Result