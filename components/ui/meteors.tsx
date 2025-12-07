"use client"

import { cn } from "@/lib/utils"
import React, { useState, useEffect } from "react"

export const Meteors = ({
  number,
  className,
}: {
  number?: number
  className?: string
}) => {
  const [meteorData, setMeteorData] = useState<Array<{ delay: number; duration: number }>>([])
  const meteorCount = number || 20

  useEffect(() => {
    // Generate random values only on client side
    const data = Array.from({ length: meteorCount }, () => ({
      delay: Math.random() * 5,
      duration: Math.floor(Math.random() * (10 - 5) + 5),
    }))
    setMeteorData(data)
  }, [meteorCount])

  const meteors = new Array(meteorCount).fill(true)
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map((el, idx) => {
        // Calculate position to evenly distribute meteors across container width
        const left = `${(idx / meteorCount) * 100}%`
        const delay = meteorData[idx]?.delay ?? 0
        const duration = meteorData[idx]?.duration ?? 5

        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute h-[2px] w-[2px] rounded-full bg-slate-700 dark:bg-slate-200 shadow-[0_0_0_1px_#ffffff10] z-0",
              "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-slate-700 before:via-slate-500 before:to-transparent before:content-['']",
              className,
            )}
            style={{
              left: left,
              top: "0px",
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          ></span>
        )
      })}
    </div>
  )
}

