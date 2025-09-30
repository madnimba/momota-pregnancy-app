"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

interface ImageCaptureProps {
  onImageCapture: (imageData: string) => void
  label?: string
}

export function ImageCapture({ onImageCapture, label }: ImageCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreview(result)
        onImageCapture(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      {preview ? (
        <Card className="relative overflow-hidden">
          <img src={preview || "/placeholder.svg"} alt="Captured" className="w-full h-64 object-cover" />
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={clearImage}
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-32 flex-col gap-2 border-2 border-dashed hover:border-primary hover:bg-primary/5 bg-transparent"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.setAttribute("capture", "environment")
                fileInputRef.current.click()
              }
            }}
          >
            <Camera className="h-8 w-8" />
            <span className="text-sm font-medium">{t("Take Photo", "ছবি তুলুন")}</span>
          </Button>

          <Button
            variant="outline"
            className="h-32 flex-col gap-2 border-2 border-dashed hover:border-primary hover:bg-primary/5 bg-transparent"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.removeAttribute("capture")
                fileInputRef.current.click()
              }
            }}
          >
            <Upload className="h-8 w-8" />
            <span className="text-sm font-medium">{t("Upload Photo", "ছবি আপলোড করুন")}</span>
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-label={label || "Image upload"}
      />
    </div>
  )
}
