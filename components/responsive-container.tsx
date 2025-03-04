"use client";

import { ReactNode } from "react";
import { getDeviceType } from "@/lib/device-detection";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveContainer({ children, className = "" }: ResponsiveContainerProps) {
  const deviceType = getDeviceType();
  
  return (
    <div className={`
      ${deviceType === 'mobile' ? 'px-4' : 'container'}
      mx-auto
      ${className}
    `}>
      {children}
    </div>
  );
}