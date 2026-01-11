"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string | null
    fallback?: string
    alt?: string
    size?: "xs" | "sm" | "default" | "lg" | "xl"
}

export function Avatar({ className, src, fallback = "?", alt = "Avatar", size = "default", ...props }: AvatarProps) {
    const [hasError, setHasError] = React.useState(false)

    const sizes = {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-xs",
        default: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-24 w-24 text-xl"
    }

    return (
        <div
            className={cn("relative flex shrink-0 overflow-hidden rounded-full bg-muted", sizes[size], className)}
            {...props}
        >
            {src && !hasError ? (
                <img
                    src={src}
                    alt={alt}
                    className="aspect-square h-full w-full object-cover"
                    onError={() => setHasError(true)}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground uppercase">
                    {fallback.slice(0, 2)}
                </div>
            )}
        </div>
    )
}
