import React from 'react'
import { Button } from './ui/button'
import { Spinner } from "@/components/ui/spinner"
import { cn } from '@/lib/utils'
const ButtonLoadder = ({text,className,type,loading,onClick, ...props}) => {
  return (
    <Button  
    type={type} 
    disabled={loading}
    className={cn('',className)} 
    {...props}
    onClick={onClick}>
  {text}
  {loading &&(
  <Spinner />
  )}
</Button>
  )
}

export default ButtonLoadder