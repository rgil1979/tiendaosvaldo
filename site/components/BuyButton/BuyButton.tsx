"use client"

import { trackEvent } from "@/lib/analytics"

interface Props {
  href: string
  productId: string
  productName: string
  className?: string
  children: React.ReactNode
}

export default function BuyButton({ href, productId, productName, className, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={className}
      onClick={() =>
        trackEvent("click_buy_ml", {
          item_id: productId,
          item_name: productName,
          event_category: "engagement",
        })
      }
    >
      {children}
    </a>
  )
}
