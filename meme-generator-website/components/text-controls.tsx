"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Trash2,
  Type,
  Smile,
  Palette,
  Settings2
} from "lucide-react"
import type { TextElement } from "@/components/meme-editor"
import { useLanguage } from "./providers/language-provider"

interface TextControlsProps {
  textElements: TextElement[]
  selectedTextId: string | null
  onSelectText: (id: string) => void
  onUpdateText: (id: string, updates: Partial<TextElement>) => void
  onAddText: () => void
  onDeleteText: (id: string) => void
}

const fonts = [
  { value: "Impact", label: "Impact" },
  { value: "Arial Black", label: "Arial Black" },
  { value: "Comic Sans MS", label: "Comic Sans" },
]

const colors = [
  "#ffffff",
  "#000000",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
]

const emojis = ["😂", "🤣", "😭", "🔥", "💀", "👀", "💯", "🙃", "😎", "🤔", "😤", "🥺"]

export function TextControls({
  textElements,
  selectedTextId,
  onSelectText,
  onUpdateText,
  onAddText,
  onDeleteText,
}: TextControlsProps) {
  const { t } = useLanguage()
  const selectedText = textElements.find((t) => t.id === selectedTextId)

  const addEmoji = (emoji: string) => {
    if (selectedText) {
      onUpdateText(selectedText.id, { text: selectedText.text + emoji })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Layers
          </h3>
          <Button onClick={onAddText} size="sm" className="rounded-full font-bold h-7 px-4 shadow-lg shadow-primary/20">
            <Plus className="w-3.5 h-3.5 mr-1" />
            {t("editor_add_text")}
          </Button>
        </div>

        <div className="space-y-3">
          {textElements.map((element, index) => (
            <Card
              key={element.id}
              className={`p-3 cursor-pointer transition-all duration-300 border shadow-sm ${selectedTextId === element.id
                ? "ring-2 ring-primary/20 border-primary bg-primary/5"
                : "border-white/5 hover:border-primary/30 hover:bg-white/5 bg-transparent"
                }`}
              onClick={() => onSelectText(element.id)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg ${selectedTextId === element.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                    <Type className="w-4 h-4" />
                  </div>
                  <span className={`text-sm font-bold truncate ${selectedTextId === element.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {element.text || `Text ${index + 1}`}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteText(element.id)
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedText ? (
        <div className="space-y-6 pt-6 border-t border-white/5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Settings2 className="w-4 h-4" />
              <h4 className="text-xs font-black uppercase tracking-widest">Configuration</h4>
            </div>
            <div>
              <Label htmlFor="text-input" className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-tighter">
                Content
              </Label>
              <Input
                id="text-input"
                value={selectedText.text}
                onChange={(e) => onUpdateText(selectedText.id, { text: e.target.value })}
                className="rounded-xl border-white/10 bg-black/20 focus:ring-primary/20 h-10 font-medium"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground mb-3 block uppercase tracking-tighter">Quick Emoji</Label>
              <div className="grid grid-cols-6 gap-1">
                {emojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="outline"
                    size="sm"
                    className="h-10 p-0 text-lg bg-transparent border-white/5 hover:bg-primary/10 hover:border-primary/20 transition-all"
                    onClick={() => addEmoji(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary pt-2">
              <Palette className="w-4 h-4" />
              <h4 className="text-xs font-black uppercase tracking-widest">Style</h4>
            </div>
            <div>
              <Label className="text-xs font-bold text-muted-foreground mb-3 block uppercase tracking-tighter">
                Size: <span className="text-primary">{selectedText.fontSize}px</span>
              </Label>
              <Slider
                value={[selectedText.fontSize]}
                onValueChange={([value]) => onUpdateText(selectedText.id, { fontSize: value })}
                min={16}
                max={120}
                step={2}
                className="py-2"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground mb-3 block uppercase tracking-tighter">Font Family</Label>
              <Select
                value={selectedText.fontFamily}
                onValueChange={(value) => onUpdateText(selectedText.id, { fontFamily: value })}
              >
                <SelectTrigger className="rounded-xl border-white/10 bg-black/20 h-10 font-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  {fonts.map((font) => (
                    <SelectItem key={font.value} value={font.value} className="font-bold">
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground mb-3 block uppercase tracking-tighter">Colors</Label>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`w-full aspect-square rounded-full border-2 transition-all hover:scale-110 shadow-lg ${selectedText.color === color
                      ? "border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                      : "border-transparent"
                      }`}
                    style={{ backgroundColor: color }}
                    onClick={() => onUpdateText(selectedText.id, { color })}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground mb-3 block uppercase tracking-tighter">Alignment</Label>
              <div className="flex gap-2">
                {[
                  { value: "left", icon: AlignLeft, label: "Left" },
                  { value: "center", icon: AlignCenter, label: "Center" },
                  { value: "right", icon: AlignRight, label: "Right" },
                ].map(({ value, icon: Icon, label }) => (
                  <Button
                    key={value}
                    variant={selectedText.align === value ? "default" : "outline"}
                    size="sm"
                    className="flex-1 rounded-xl h-10 border-white/5"
                    onClick={() => onUpdateText(selectedText.id, { align: value as "left" | "center" | "right" })}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="sr-only">{label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 px-6 border border-dashed border-white/10 rounded-2xl bg-white/5">
          <Smile className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Select a layer to edit
          </p>
        </div>
      )}
    </div>
  )
}
