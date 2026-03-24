"use client"

import { useState, useRef, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { TemplateGallery } from "@/components/template-gallery"
import { MemeEditor, type TextElement } from "@/components/meme-editor"
import { TextControls } from "@/components/text-controls"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Download,
  Share2,
  RotateCcw,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check,
  Zap,
  ShieldCheck
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import type { MemeTemplate } from "@/lib/meme-templates"
import { useLanguage } from "@/components/providers/language-provider"
import { motion, AnimatePresence } from "framer-motion"

export default function CreaMemePage() {
  const { t } = useLanguage()
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null)
  const [customImage, setCustomImage] = useState<string | null>(null)
  const [showWatermark, setShowWatermark] = useState(true)
  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: "top",
      text: "TOP TEXT",
      x: 0.5,
      y: 0.1,
      fontSize: 40,
      color: "#ffffff",
      fontFamily: "Impact",
      align: "center",
    },
    {
      id: "bottom",
      text: "BOTTOM TEXT",
      x: 0.5,
      y: 0.9,
      fontSize: 40,
      color: "#ffffff",
      fontFamily: "Impact",
      align: "center",
    },
  ])
  const [selectedTextId, setSelectedTextId] = useState<string | null>("top")
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleSelectTemplate = (template: MemeTemplate | null, image?: string) => {
    if (image) {
      setCustomImage(image)
      setSelectedTemplate(null)
    } else {
      setSelectedTemplate(template)
      setCustomImage(null)
    }
  }

  const handleTextDragEnd = useCallback((id: string, x: number, y: number) => {
    setTextElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    )
  }, [])

  const handleUpdateText = useCallback((id: string, updates: Partial<TextElement>) => {
    setTextElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    )
  }, [])

  const handleAddText = () => {
    const newId = `text-${Date.now()}`
    setTextElements((prev) => [
      ...prev,
      {
        id: newId,
        text: "New text",
        x: 0.5,
        y: 0.5,
        fontSize: 32,
        color: "#ffffff",
        fontFamily: "Impact",
        align: "center",
      },
    ])
    setSelectedTextId(newId)
  }

  const handleDeleteText = (id: string) => {
    setTextElements((prev) => prev.filter((el) => el.id !== id))
    if (selectedTextId === id) {
      setSelectedTextId(textElements[0]?.id || null)
    }
  }

  const handleReset = () => {
    setSelectedTemplate(null)
    setCustomImage(null)
    setTextElements([
      {
        id: "top",
        text: "TOP TEXT",
        x: 0.5,
        y: 0.1,
        fontSize: 40,
        color: "#ffffff",
        fontFamily: "Impact",
        align: "center",
      },
      {
        id: "bottom",
        text: "BOTTOM TEXT",
        x: 0.5,
        y: 0.9,
        fontSize: 40,
        color: "#ffffff",
        fontFamily: "Impact",
        align: "center",
      },
    ])
    setSelectedTextId("top")
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `meme-aetherdev-${Date.now()}.png`
    link.href = canvas.toDataURL("image/png", 1.0)
    link.click()
  }

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(t("dialog_share_desc"))
    const url = encodeURIComponent("https://memeforge.app")

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    }

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400")
    }
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText("https://memeforge.app")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            <Zap className="w-3.5 h-3.5" />
            {t("hero_badge")}
          </div>
          <h1
            className="text-4xl md:text-6xl font-black mb-4 tracking-tighter"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t("editor_title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("editor_subtitle")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[340px_1fr_340px] gap-8 items-start">
          {/* Left Sidebar - Templates */}
          <Card className="glass-card p-6 h-fit lg:sticky lg:top-28">
            <TemplateGallery
              onSelectTemplate={handleSelectTemplate}
              selectedTemplate={selectedTemplate}
              customImage={customImage}
            />
          </Card>

          {/* Center - Editor */}
          <div className="space-y-8">
            <Card className="glass-card p-4 lg:p-1 overflow-hidden relative group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <MemeEditor
                template={selectedTemplate}
                customImage={customImage}
                textElements={textElements}
                onTextDragEnd={handleTextDragEnd}
                canvasRef={canvasRef}
                showWatermark={showWatermark}
              />

              <div className="flex items-center justify-center gap-4 py-4 bg-black/20 backdrop-blur-md">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {t("editor_drag_hint")}
                </p>
              </div>
            </Card>

            {/* Premium Watermark Toggle */}
            <div className="glass-card p-6 flex items-center justify-between group hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-colors ${showWatermark ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight">{t("editor_watermark")}</h4>
                  <p className="text-xs text-muted-foreground">Certified by AetherDev</p>
                </div>
              </div>
              <Switch
                checked={showWatermark}
                onCheckedChange={setShowWatermark}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="outline"
                onClick={handleReset}
                className="rounded-full h-12 px-8 font-bold border-white/10 hover:bg-white/5"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("editor_reset")}
              </Button>
              <Button
                onClick={handleDownload}
                size="lg"
                className="rounded-full h-12 px-8 font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all"
                disabled={!selectedTemplate && !customImage}
              >
                <Download className="w-4 h-4 mr-2" />
                {t("editor_download")}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShareDialogOpen(true)}
                className="rounded-full h-12 px-8 font-bold glass shadow-xl"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t("editor_share")}
              </Button>
            </div>
          </div>

          {/* Right Sidebar - Text Controls */}
          <Card className="glass-card p-6 h-fit lg:sticky lg:top-28">
            <TextControls
              textElements={textElements}
              selectedTextId={selectedTextId}
              onSelectText={setSelectedTextId}
              onUpdateText={handleUpdateText}
              onAddText={handleAddText}
              onDeleteText={handleDeleteText}
            />
          </Card>
        </div>
      </main>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="glass-card border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
              {t("dialog_share_title")}
            </DialogTitle>
            <DialogDescription className="font-medium text-muted-foreground">
              {t("dialog_share_desc")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-6">
            <Button
              variant="outline"
              className="h-16 rounded-2xl border-white/5 hover:border-primary/30 transition-all font-bold group"
              onClick={() => handleShare("twitter")}
            >
              <Twitter className="w-5 h-5 mr-3 group-hover:text-[#1DA1F2] transition-colors" />
              Twitter
            </Button>
            <Button
              variant="outline"
              className="h-16 rounded-2xl border-white/5 hover:border-primary/30 transition-all font-bold group"
              onClick={() => handleShare("facebook")}
            >
              <Facebook className="w-5 h-5 mr-3 group-hover:text-[#4267B2] transition-colors" />
              Facebook
            </Button>
            <Button
              variant="outline"
              className="h-16 rounded-2xl border-white/5 hover:border-primary/30 transition-all font-bold group"
              onClick={() => handleShare("linkedin")}
            >
              <Linkedin className="w-5 h-5 mr-3 group-hover:text-[#0077b5] transition-colors" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              className="h-16 rounded-2xl border-white/5 hover:border-primary/30 transition-all font-bold group"
              onClick={handleCopyLink}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 mr-3 text-green-500" />
                  {t("dialog_copied")}
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-3 group-hover:text-primary transition-colors" />
                  {t("dialog_copy_link")}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
