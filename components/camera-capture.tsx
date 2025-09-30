"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Camera, Upload, X, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

interface CameraCaptureProps {
  onImageCapture: (imageData: string) => void
  label?: string
}

export function CameraCapture({ onImageCapture, label }: CameraCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })
      setStream(mediaStream)
      setShowCamera(true)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Camera access denied:", error)
      // Fallback to file input if camera access fails
      fileInputRef.current?.click()
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg")
        setPreview(imageData)
        onImageCapture(imageData)
        stopCamera()
      }
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

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

  if (showCamera) {
    return (
      <Card className="relative overflow-hidden bg-black">
        <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4">
          <Button size="lg" onClick={capturePhoto} className="rounded-full w-16 h-16 p-0">
            <Camera className="h-6 w-6" />
          </Button>
          <Button size="lg" variant="secondary" onClick={stopCamera} className="rounded-full">
            <X className="h-5 w-5 mr-2" />
            {t("Cancel", "বাতিল")}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {preview ? (
        <Card className="relative overflow-hidden">
          <img src={preview || "/placeholder.svg"} alt="Captured" className="w-full h-64 object-cover" />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button size="icon" variant="secondary" onClick={clearImage} aria-label="Retake photo">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="destructive" onClick={clearImage} aria-label="Remove image">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-32 flex-col gap-2 border-2 border-dashed hover:border-primary hover:bg-primary/5 bg-transparent"
            onClick={startCamera}
          >
            <Camera className="h-8 w-8" />
            <span className="text-sm font-medium">{t("Take Photo", "ছবি তুলুন")}</span>
          </Button>

          <Button
            variant="outline"
            className="h-32 flex-col gap-2 border-2 border-dashed hover:border-primary hover:bg-primary/5 bg-transparent"
            onClick={() => fileInputRef.current?.click()}
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
