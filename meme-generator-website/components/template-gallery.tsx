"use client"

import React from "react"
import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { memeTemplates, categories, type MemeTemplate } from "@/lib/meme-templates"
import { Upload, ImageIcon, X } from "lucide-react"
import { useLanguage } from "./providers/language-provider"

interface TemplateGalleryProps {
  onSelectTemplate: (template: MemeTemplate | null, customImage?: string) => void
  selectedTemplate: MemeTemplate | null
  customImage: string | null
}

export function TemplateGallery({ onSelectTemplate, selectedTemplate, customImage }: TemplateGalleryProps) {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState("tutti")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredTemplates = activeCategory === "tutti"
    ? memeTemplates
    : memeTemplates.filter(t => t.category === activeCategory)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onSelectTemplate(null, result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const clearCustomImage = () => {
    onSelectTemplate(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          {activeCategory === "tutti" ? "Upload" : "Custom"}
        </h3>
        <div
          className={`
            relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300
            ${dragActive ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.1)]" : "border-white/10 hover:border-primary/50 hover:bg-white/5"}
            ${customImage ? "border-primary bg-primary/5" : ""}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {customImage ? (
            <div className="relative group">
              <img
                src={customImage || "/placeholder.svg"}
                alt="Uploaded"
                className="max-h-40 mx-auto rounded-xl object-contain shadow-2xl"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg"
                onClick={clearCustomImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground">
                PNG, JPG, WEBP...
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full font-bold border-white/10"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Select
              </Button>
            </div>
          )}
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Templates
        </h3>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              className="rounded-full font-black uppercase tracking-tighter h-7 px-3 text-[10px] border-white/5"
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`
                aspect-square cursor-pointer overflow-hidden border-2 transition-all duration-300 rounded-lg
                ${selectedTemplate?.id === template.id && !customImage
                  ? "border-primary ring-2 ring-primary/20 scale-95"
                  : "border-transparent hover:border-primary/50 hover:scale-105"
                }
              `}
              onClick={() => onSelectTemplate(template)}
            >
              <div
                className="w-full h-full"
                style={{ background: template.bgColor }}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
