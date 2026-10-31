import Image from 'next/image'
import React from 'react'
import image from '@/public/assets/images/loading.svg'
const Loading = ({className}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
        <Image src={image.src} height={80} width={80} alt='loading' />
    </div>
  )
}

export default Loading