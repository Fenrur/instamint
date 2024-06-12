import {ThreeDots} from "react-loader-spinner"
import React from "react"

interface LoadingDotsProps {
  visible?: boolean,
  size: number,
  lightThemeColor: string,
  darkThemeColor: string
}

export const dynamic = "force-dynamic"

export function DefaultLoadingDots({visible = true, size = 50}: {visible?: boolean, size?: number}) {
  return (
    <LoadingDots size={size} visible={visible} lightThemeColor={"fill-white"} darkThemeColor={"fill-black"}/>
  )
}

export function BackgroundLoadingDots({visible = true, size = 50}: {visible?: boolean, size?: number}) {
  return (
    <LoadingDots size={size} visible={visible} lightThemeColor={"fill-white"} darkThemeColor={"fill-white"}/>
  )
}

export function LoadingDots({visible = true, size, lightThemeColor, darkThemeColor}: LoadingDotsProps) {
  return (
    <ThreeDots
      visible={visible}
      color={""}
      width={size}
      height={size}
      ariaLabel="three-dots-loading"
      wrapperClass={`${lightThemeColor} dark:${darkThemeColor}`}
    />
  )
}
