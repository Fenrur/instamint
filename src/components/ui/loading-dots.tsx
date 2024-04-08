import {ThreeDots} from "react-loader-spinner"
import React from "react"

interface LoadingDotsProps {
  visible?: boolean,
  size: number,
  color?: string,
}

export function LoadingDots({visible = true, color = "white", size}: LoadingDotsProps) {
  return (
    <ThreeDots
      visible={visible}
      color={color}
      width={size}
      height={size}
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  )
}
