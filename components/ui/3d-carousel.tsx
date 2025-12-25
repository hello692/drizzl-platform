"use client"

import { memo, useEffect, useLayoutEffect, useMemo, useState } from "react"
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion"
import Link from "next/link"

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  const handleChange = () => {
    setMatches(getMatches(query))
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)
    handleChange()

    matchMedia.addEventListener("change", handleChange)

    return () => {
      matchMedia.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}

export interface ProductItem {
  id: string
  name: string
  price: number
  image: string
  badge?: string
}

const duration = 0.15
const transition = { duration, ease: [0.32, 0.72, 0, 1] as const }
const transitionOverlay = { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const }

const Carousel = memo(
  ({
    handleClick,
    controls,
    products,
    isCarouselActive,
  }: {
    handleClick: (product: ProductItem, index: number) => void
    controls: any
    products: ProductItem[]
    isCarouselActive: boolean
  }) => {
    const isScreenSizeSm = useMediaQuery("(max-width: 640px)")
    const cylinderWidth = isScreenSizeSm ? 1100 : 1800
    const faceCount = products.length
    const faceWidth = cylinderWidth / faceCount
    const radius = cylinderWidth / (2 * Math.PI)
    const rotation = useMotionValue(0)
    const transform = useTransform(
      rotation,
      (value) => `rotate3d(0, 1, 0, ${value}deg)`
    )

    return (
      <div
        className="carousel-3d-container"
        style={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          perspective: "1000px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          drag={isCarouselActive ? "x" : false}
          className="carousel-3d-track"
          style={{
            transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
            position: "relative",
            display: "flex",
            height: "100%",
            justifyContent: "center",
            cursor: "grab",
          }}
          onDrag={(_, info) =>
            isCarouselActive &&
            rotation.set(rotation.get() + info.offset.x * 0.05)
          }
          onDragEnd={(_, info) =>
            isCarouselActive &&
            controls.start({
              rotateY: rotation.get() + info.velocity.x * 0.05,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 30,
                mass: 0.1,
              },
            })
          }
          animate={controls}
        >
          {products.map((product, i) => (
            <motion.div
              key={`key-${product.id}-${i}`}
              className="carousel-3d-card"
              style={{
                position: "absolute",
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "16px",
                background: "#0a0a0a",
                padding: "8px",
                width: `${faceWidth}px`,
                transform: `rotateY(${
                  i * (360 / faceCount)
                }deg) translateZ(${radius}px)`,
              }}
              onClick={() => handleClick(product, i)}
            >
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                gap: "12px",
                width: "100%"
              }}>
                {product.badge && (
                  <span style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    color: product.badge === "NEW" ? "#22c55e" : "#ffffff",
                    background: product.badge === "NEW" ? "rgba(34, 197, 94, 0.15)" : "rgba(255,255,255,0.1)",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    border: product.badge === "NEW" ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(255,255,255,0.2)",
                  }}>
                    {product.badge}
                  </span>
                )}
                <motion.img
                  src={product.image}
                  alt={product.name}
                  layoutId={`img-${product.id}`}
                  style={{
                    pointerEvents: "none",
                    width: "100%",
                    maxWidth: "180px",
                    borderRadius: "12px",
                    objectFit: "cover",
                    aspectRatio: "1/1",
                  }}
                  initial={{ filter: "blur(4px)" }}
                  layout="position"
                  animate={{ filter: "blur(0px)" }}
                  transition={transition}
                />
                <div style={{ textAlign: "center" }}>
                  <p style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#ffffff",
                    marginBottom: "4px",
                  }}>
                    {product.name}
                  </p>
                  <p style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.6)",
                  }}>
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  }
)

Carousel.displayName = "Carousel"

interface ThreeDProductCarouselProps {
  products: ProductItem[]
}

function ThreeDProductCarousel({ products }: ThreeDProductCarouselProps) {
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null)
  const [isCarouselActive, setIsCarouselActive] = useState(true)
  const controls = useAnimation()

  const handleClick = (product: ProductItem) => {
    setActiveProduct(product)
    setIsCarouselActive(false)
    controls.stop()
  }

  const handleClose = () => {
    setActiveProduct(null)
    setIsCarouselActive(true)
  }

  return (
    <motion.div layout style={{ position: "relative" }}>
      <AnimatePresence mode="sync">
        {activeProduct && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            layoutId={`img-container-${activeProduct.id}`}
            layout="position"
            onClick={handleClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.9)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              margin: "20px",
              borderRadius: "24px",
              cursor: "pointer",
              willChange: "opacity",
            }}
            transition={transitionOverlay}
          >
            <motion.img
              layoutId={`img-${activeProduct.id}`}
              src={activeProduct.image}
              alt={activeProduct.name}
              style={{
                maxWidth: "300px",
                maxHeight: "300px",
                borderRadius: "16px",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                marginBottom: "24px",
              }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.5,
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />
            <h3 style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#ffffff",
              marginBottom: "8px",
            }}>
              {activeProduct.name}
            </h3>
            <p style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "24px",
            }}>
              ${activeProduct.price.toFixed(2)}
            </p>
            <Link
              href={`/products/${activeProduct.id}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "#ffffff",
                color: "#000000",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "background 150ms ease",
              }}
            >
              View Product
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <p style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.4)",
              marginTop: "16px",
            }}>
              Click anywhere to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ 
        position: "relative", 
        height: "400px", 
        width: "100%", 
        overflow: "hidden" 
      }}>
        <Carousel
          handleClick={handleClick}
          controls={controls}
          products={products}
          isCarouselActive={isCarouselActive}
        />
      </div>
    </motion.div>
  )
}

export { ThreeDProductCarousel }
