"use client"

import React from "react"

import { useRef, useEffect, useCallback } from "react"
import type { MemeTemplate } from "@/lib/meme-templates"

export interface TextElement {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  fontFamily: string
  align: "left" | "center" | "right"
  isDragging?: boolean
}

interface MemeEditorProps {
  template: MemeTemplate | null
  customImage: string | null
  textElements: TextElement[]
  onTextDragEnd: (id: string, x: number, y: number) => void
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  showWatermark?: boolean
}

export function MemeEditor({
  template,
  customImage,
  textElements,
  onTextDragEnd,
  canvasRef,
  showWatermark = true
}: MemeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef<string | null>(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement | null>(null)

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = 800 // High quality
    canvas.width = size
    canvas.height = size

    // Draw background
    if (customImage && imageRef.current) {
      const img = imageRef.current
      const imgRatio = img.width / img.height
      let drawWidth = size
      let drawHeight = size
      let offsetX = 0
      let offsetY = 0

      if (imgRatio > 1) {
        drawHeight = size / imgRatio
        offsetY = (size - drawHeight) / 2
      } else {
        drawWidth = size * imgRatio
        offsetX = (size - drawWidth) / 2
      }

      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    } else if (template) {
      if (template.bgColor.includes("gradient")) {
        const gradientMatch = template.bgColor.match(/linear-gradient\((\d+)deg,\s*([^,]+)\s*0%,\s*([^)]+)\s*100%\)/)
        if (gradientMatch) {
          const angle = parseInt(gradientMatch[1])
          const color1 = gradientMatch[2].trim()
          const color2 = gradientMatch[3].trim()

          const angleRad = (angle - 90) * Math.PI / 180
          const x1 = size / 2 - Math.cos(angleRad) * size / 2
          const y1 = size / 2 - Math.sin(angleRad) * size / 2
          const x2 = size / 2 + Math.cos(angleRad) * size / 2
          const y2 = size / 2 + Math.sin(angleRad) * size / 2

          const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
          gradient.addColorStop(0, color1)
          gradient.addColorStop(1, color2)
          ctx.fillStyle = gradient
        }
      } else {
        ctx.fillStyle = template.bgColor
      }
      ctx.fillRect(0, 0, size, size)
    } else {
      ctx.fillStyle = "#111"
      ctx.fillRect(0, 0, size, size)
    }

    // Draw text elements
    textElements.forEach((element) => {
      const x = element.x * size
      const y = element.y * size
      // Scale font size for high quality canvas
      const fontSize = (element.fontSize * size) / 500

      ctx.font = `bold ${fontSize}px ${element.fontFamily}`
      ctx.textAlign = element.align
      ctx.textBaseline = "middle"

      // Better Text shadow/stroke
      ctx.shadowColor = "rgba(0,0,0,0.8)"
      ctx.shadowBlur = fontSize / 8
      ctx.strokeStyle = "#000"
      ctx.lineWidth = fontSize / 8
      ctx.lineJoin = "round"
      ctx.miterLimit = 2

      let textX = x
      if (element.align === "center") textX = size / 2
      else if (element.align === "right") textX = size - 40

      ctx.strokeText(element.text, textX, y)
      ctx.shadowBlur = 0 // Reset shadow for fill
      ctx.fillStyle = element.color
      ctx.fillText(element.text, textX, y)
    })

    // Draw Watermark
    if (showWatermark) {
      ctx.save()
      ctx.font = "italic bold 16px var(--font-playfair), serif"
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
      ctx.textAlign = "right"
      ctx.textBaseline = "bottom"
      ctx.shadowColor = "rgba(0,0,0,0.3)"
      ctx.shadowBlur = 4
      ctx.fillText("AetherDev di Abdel", size - 20, size - 20)
      ctx.restore()
    }
  }, [template, customImage, textElements, canvasRef, showWatermark])

  // Load custom image
  useEffect(() => {
    if (customImage) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        imageRef.current = img
        drawCanvas()
      }
      img.src = customImage
    } else {
      imageRef.current = null
      drawCanvas()
    }
  }, [customImage, drawCanvas])

  // Redraw on text changes
  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const mouseX = (e.clientX - rect.left) * scaleX
    const mouseY = (e.clientY - rect.top) * scaleY

    // Check if clicking on a text element (reverse order for z-index)
    for (let i = textElements.length - 1; i >= 0; i--) {
      const element = textElements[i]
      const ctx = canvas.getContext("2d")
      if (!ctx) continue

      ctx.font = `bold ${element.fontSize}px ${element.fontFamily}`
      const textWidth = ctx.measureText(element.text).width
      const textHeight = element.fontSize

      let textX = element.x * canvas.width
      if (element.align === "center") textX = canvas.width / 2 - textWidth / 2
      else if (element.align === "right") textX = canvas.width - 20 - textWidth
      else textX = element.x * canvas.width - (element.align === "left" ? 0 : textWidth / 2)

      const textY = element.y * canvas.height - textHeight / 2

      if (
        mouseX >= textX - 10 &&
        mouseX <= textX + textWidth + 10 &&
        mouseY >= textY - 10 &&
        mouseY <= textY + textHeight + 10
      ) {
        isDraggingRef.current = element.id
        dragOffsetRef.current = {
          x: mouseX - element.x * canvas.width,
          y: mouseY - element.y * canvas.height
        }
        break
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const mouseX = (e.clientX - rect.left) * scaleX
    const mouseY = (e.clientY - rect.top) * scaleY

    const newX = Math.max(0, Math.min(1, (mouseX - dragOffsetRef.current.x) / canvas.width))
    const newY = Math.max(0, Math.min(1, (mouseY - dragOffsetRef.current.y) / canvas.height))

    onTextDragEnd(isDraggingRef.current, newX, newY)
  }

  const handleMouseUp = () => {
    isDraggingRef.current = null
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY } as React.MouseEvent)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY } as React.MouseEvent)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[500px] mx-auto"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-xl shadow-2xl cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      />
      {!template && !customImage && (
        <div className="absolute inset-0 flex items-center justify-center text-white/70 pointer-events-none">
          <p className="text-center px-8">
            Seleziona un template o carica un&apos;immagine per iniziare
          </p>
        </div>
      )}
    </div>
  )
}
