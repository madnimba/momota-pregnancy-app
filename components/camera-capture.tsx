// "use client"

// import type React from "react"
// import { useState, useRef, useEffect } from "react"
// import { Camera, Upload, X, RotateCcw } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { useLanguage } from "@/lib/language-context"

// interface CameraCaptureProps {
//   onImageCapture: (imageData: string) => void
//   label?: string
// }

// export function CameraCapture({ onImageCapture, label }: CameraCaptureProps) {
//   const [preview, setPreview] = useState<string | null>(null)
//   const [showCamera, setShowCamera] = useState(false)
//   const [stream, setStream] = useState<MediaStream | null>(null)
//   const [isVideoReady, setIsVideoReady] = useState(false)
//   const [cameraError, setCameraError] = useState<string | null>(null)
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const { t } = useLanguage()

//   // Load saved photo on mount
//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem("momota-last-photo")
//       if (saved) setPreview(saved)
//     } catch (error) {
//       console.warn("Could not load saved photo:", error)
//     }
//   }, [])

//   // Cleanup stream on unmount
//   useEffect(() => {
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach((track) => track.stop())
//       }
//     }
//   }, [stream])

//   const startCamera = async () => {
//     try {
//       setIsVideoReady(false)
//       setCameraError(null)
      
//       // Check if camera is supported
//       if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//         throw new Error("Camera not supported in this browser")
//       }
      
//       // Request camera access with constraints
//       let mediaStream: MediaStream
//       try {
//         // Try back camera first (environment)
//         mediaStream = await navigator.mediaDevices.getUserMedia({
//           video: { 
//             facingMode: { ideal: "environment" },
//             width: { ideal: 1280 },
//             height: { ideal: 720 }
//           },
//           audio: false,
//         })
//       } catch (envError) {
//         console.warn("Back camera failed, trying front camera:", envError)
//         // Fallback to any available camera
//         mediaStream = await navigator.mediaDevices.getUserMedia({
//           video: { 
//             width: { ideal: 1280 },
//             height: { ideal: 720 }
//           },
//           audio: false,
//         })
//       }

//       setStream(mediaStream)
//       setShowCamera(true)

//       if (videoRef.current) {
//         const video = videoRef.current
        
//         // Configure video element for mobile compatibility
//         video.muted = true
//         video.playsInline = true
//         video.autoplay = true
//         video.srcObject = mediaStream

//         // Function to check if video has valid dimensions
//         const checkVideoReady = () => {
//           if (video.videoWidth > 0 && video.videoHeight > 0) {
//             console.log("Video ready with dimensions:", video.videoWidth, "x", video.videoHeight)
//             setIsVideoReady(true)
//             return true
//           }
//           return false
//         }

//         // Set up event handlers
//         const handleLoadedMetadata = () => {
//           console.log("Video metadata loaded")
//           checkVideoReady()
//         }

//         const handleCanPlay = () => {
//           console.log("Video can play")
//           // Small delay to ensure dimensions are available
//           setTimeout(checkVideoReady, 100)
//         }

//         const handlePlaying = () => {
//           console.log("Video is playing")
//           checkVideoReady()
//         }

//         // Add event listeners
//         video.addEventListener('loadedmetadata', handleLoadedMetadata)
//         video.addEventListener('canplay', handleCanPlay)
//         video.addEventListener('playing', handlePlaying)

//         // Try to start playback
//         const playPromise = video.play()
//         if (playPromise !== undefined) {
//           playPromise
//             .then(() => {
//               console.log("Video playback started successfully")
//               // Check again after play starts
//               setTimeout(checkVideoReady, 200)
//             })
//             .catch((error) => {
//               console.warn("Video autoplay was prevented:", error)
//               // Even if autoplay fails, we can still try to capture
//               checkVideoReady()
//             })
//         }

//         // Fallback timeout to force ready state if needed
//         const timeoutId = setTimeout(() => {
//           if (!isVideoReady) {
//             console.warn("Video ready timeout - forcing ready state")
//             setIsVideoReady(true)
//           }
//         }, 3000)

//         // Cleanup function
//         return () => {
//           clearTimeout(timeoutId)
//           video.removeEventListener('loadedmetadata', handleLoadedMetadata)
//           video.removeEventListener('canplay', handleCanPlay)
//           video.removeEventListener('playing', handlePlaying)
//         }
//       }
//     } catch (error) {
//       console.error("Camera startup failed:", error)
//       const errorMessage = error instanceof Error ? error.message : "Unknown camera error"
//       setCameraError(errorMessage)
//       setShowCamera(false)
//     }
//   }

//   const capturePhoto = () => {
//     if (!videoRef.current || !canvasRef.current) {
//       console.error("Video or canvas ref not available")
//       return
//     }

//     const video = videoRef.current
//     const canvas = canvasRef.current
    
//     // Get video dimensions
//     const width = video.videoWidth || video.clientWidth
//     const height = video.videoHeight || video.clientHeight
    
//     if (!width || !height) {
//       console.warn("Could not get video dimensions:", { width, height })
//       // Try with client dimensions as fallback
//       const fallbackWidth = video.clientWidth || 640
//       const fallbackHeight = video.clientHeight || 480
//       canvas.width = fallbackWidth
//       canvas.height = fallbackHeight
//     } else {
//       canvas.width = width
//       canvas.height = height
//     }

//     const ctx = canvas.getContext("2d")
//     if (!ctx) {
//       console.error("Could not get canvas context")
//       return
//     }

//     try {
//       // Draw the current video frame
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
//       // Convert to base64 image
//       const imageData = canvas.toDataURL("image/jpeg", 0.8)
      
//       if (imageData && imageData !== "data:,") {
//         console.log("Photo captured successfully")
//         setPreview(imageData)
        
//         // Save to localStorage
//         try {
//           localStorage.setItem("momota-last-photo", imageData)
//         } catch (storageError) {
//           console.warn("Could not save to localStorage:", storageError)
//         }
        
//         // Call the callback
//         onImageCapture(imageData)
        
//         // Stop the camera
//         stopCamera()
//       } else {
//         console.error("Failed to capture image data")
//         setCameraError("Failed to capture image")
//       }
//     } catch (captureError) {
//       console.error("Error during photo capture:", captureError)
//       setCameraError("Failed to capture photo")
//     }
//   }

//   const stopCamera = () => {
//     console.log("Stopping camera")
    
//     if (stream) {
//       stream.getTracks().forEach((track) => {
//         console.log("Stopping track:", track.kind, track.label)
//         track.stop()
//       })
//       setStream(null)
//     }
    
//     if (videoRef.current) {
//       videoRef.current.srcObject = null
//     }
    
//     setShowCamera(false)
//     setIsVideoReady(false)
//     setCameraError(null)
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         const result = reader.result as string
//         setPreview(result)
//         try {
//           localStorage.setItem("momota-last-photo", result)
//         } catch (error) {
//           console.warn("Could not save uploaded image:", error)
//         }
//         onImageCapture(result)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const clearImage = () => {
//     setPreview(null)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""
//     }
//     try {
//       localStorage.removeItem("momota-last-photo")
//     } catch (error) {
//       console.warn("Could not clear saved photo:", error)
//     }
//   }

//   // Camera view
//   if (showCamera) {
//     return (
//       <Card className="relative overflow-hidden bg-black">
//         <video 
//           ref={videoRef} 
//           autoPlay 
//           playsInline 
//           muted 
//           className="w-full h-64 object-cover"
//           style={{ backgroundColor: '#000' }}
//         />
//         <canvas ref={canvasRef} className="hidden" />
        
//         {/* Loading overlay */}
//         {!isVideoReady && (
//           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75">
//             <div className="text-white text-sm mb-2">
//               {t("Starting camera...", "ক্যামেরা চালু হচ্ছে...")}
//             </div>
//             <div className="text-white text-xs opacity-75">
//               {t("Please allow camera access", "ক্যামেরা অ্যাক্সেসের অনুমতি দিন")}
//             </div>
//           </div>
//         )}
        
//         {/* Camera controls */}
//         <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4">
//           <Button 
//             size="lg" 
//             onClick={capturePhoto} 
//             className="rounded-full w-16 h-16 p-0 bg-white text-black hover:bg-gray-100" 
//             disabled={!isVideoReady}
//           >
//             <Camera className="h-6 w-6" />
//           </Button>
          
//           <Button 
//             size="lg" 
//             variant="secondary" 
//             onClick={stopCamera} 
//             className="rounded-full"
//           >
//             <X className="h-5 w-5 mr-2" />
//             {t("Cancel", "বাতিল")}
//           </Button>
//         </div>
//       </Card>
//     )
//   }

//   // Main interface
//   return (
//     <div className="space-y-3">
//       {preview ? (
//         <Card className="relative overflow-hidden">
//           <img 
//             src={preview} 
//             alt="Captured" 
//             className="w-full h-64 object-cover" 
//           />
//           <div className="absolute top-2 right-2 flex gap-2">
//             <Button 
//               size="icon" 
//               variant="secondary" 
//               onClick={clearImage} 
//               aria-label="Retake photo"
//             >
//               <RotateCcw className="h-4 w-4" />
//             </Button>
//             <Button 
//               size="icon" 
//               variant="destructive" 
//               onClick={clearImage} 
//               aria-label="Remove image"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-2 gap-3">
//           <Button
//             variant="outline"
//             className="h-32 flex-col gap-2 border-2 border-dashed hover:border-primary hover:bg-primary/5 bg-transparent"
//             onClick={startCamera}
//           >
//             <Camera className="h-8 w-8" />
//             <span className="text-sm font-medium">
//               {t("Take Photo", "ছবি তুলুন")}
//             </span>
//           </Button>

//           <Button
//             variant="outline"
//             className="h-32 flex-col gap-2 border-2 border-dashed hover:border-primary hover:bg-primary/5 bg-transparent"
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <Upload className="h-8 w-8" />
//             <span className="text-sm font-medium">
//               {t("Upload Photo", "ছবি আপলোড করুন")}
//             </span>
//           </Button>
//         </div>
//       )}

//       {/* Error message */}
//       {cameraError && (
//         <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
//           {t("Camera error: ", "ক্যামেরা ত্রুটি: ")}{cameraError}
//         </div>
//       )}

//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         capture="environment"
//         className="hidden"
//         onChange={handleFileChange}
//         aria-label={label || "Image upload"}
//       />
//     </div>
//   )
// }


"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

interface CameraCaptureProps {
  onImageCapture: (imageData: string) => void;
  label?: string;
}

export function CameraCapture({ onImageCapture, label }: CameraCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Load saved photo on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("momota-last-photo");
      if (saved) setPreview(saved);
    } catch (error) {
      console.warn("Could not load saved photo:", error);
    }
  }, []);

  // Bind/unbind media stream to video element + manage readiness
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    // iOS/Safari friendly attributes
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("autoplay", "true");

    (video as any).srcObject = stream;

    const checkReady = () => {
      const ready =
        video.videoWidth > 0 &&
        video.videoHeight > 0 &&
        !Number.isNaN(video.videoWidth) &&
        !Number.isNaN(video.videoHeight);
      if (ready) setIsVideoReady(true);
      return ready;
    };

    const onLoadedMetadata = () => {
      // give the browser a beat to populate dimensions
      setTimeout(checkReady, 60);
    };
    const onCanPlay = () => setTimeout(checkReady, 100);
    const onPlaying = () => checkReady();

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("playing", onPlaying);

    (async () => {
      try {
        // tiny delay before play helps Chrome/Safari populate dimensions
        await new Promise((r) => setTimeout(r, 80));
        await video.play();
        setTimeout(checkReady, 150);
      } catch (e) {
        console.warn("Autoplay prevented or failed:", e);
        checkReady();
      }
    })();

    // Fallback: force "ready" after a few seconds to allow capture UI
    const fallback = setTimeout(() => {
      if (!checkReady()) {
        console.warn("Video ready timeout - forcing ready state");
        setIsVideoReady(true);
      }
    }, 3000);

    return () => {
      clearTimeout(fallback);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("playing", onPlaying);
      // Do NOT stop tracks here—only when we explicitly stop camera
      // This ensures we can switch pages/overlays without killing the stream.
      (video as any).srcObject = null;
    };
  }, [stream]);

  // Stop any live tracks when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setIsVideoReady(false);
      setCameraError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }

      let mediaStream: MediaStream;
      try {
        // Try back camera first (environment)
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (envError) {
        console.warn("Back camera failed, trying default camera:", envError);
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      }

      setStream(mediaStream);
      setShowCamera(true);
    } catch (error) {
      console.error("Camera startup failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown camera error";
      setCameraError(errorMessage);
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      (videoRef.current as any).srcObject = null;
    }
    setShowCamera(false);
    setIsVideoReady(false);
    // keep cameraError cleared to avoid stale warnings
    setCameraError(null);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas ref not available");
      return;
    }
    if (!isVideoReady) {
      setCameraError(
        t(
          "Camera is not ready yet. Please wait a moment.",
          "ক্যামেরা এখনো প্রস্তুত নয়, একটু অপেক্ষা করুন।"
        )
      );
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Ensure the current frame is painted
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    const width = video.videoWidth || video.clientWidth || 640;
    const height = video.videoHeight || video.clientHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Could not get canvas context");
      setCameraError(
        t("Failed to access canvas.", "ক্যানভাস অ্যাক্সেস করা যায়নি।")
      );
      return;
    }

    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg", 0.8);

      if (imageData && imageData !== "data:,") {
        setPreview(imageData);
        try {
          localStorage.setItem("momota-last-photo", imageData);
        } catch (storageError) {
          console.warn("Could not save to localStorage:", storageError);
        }
        onImageCapture(imageData);
        stopCamera();
      } else {
        setCameraError(t("Failed to capture image", "ছবি নেওয়া যায়নি"));
      }
    } catch (err) {
      console.error("Error during photo capture:", err);
      setCameraError(t("Failed to capture photo", "ছবি নেওয়া ব্যর্থ"));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      try {
        localStorage.setItem("momota-last-photo", result);
      } catch (error) {
        console.warn("Could not save uploaded image:", error);
      }
      onImageCapture(result);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    try {
      localStorage.removeItem("momota-last-photo");
    } catch (error) {
      console.warn("Could not clear saved photo:", error);
    }
  };

  // Camera view
  if (showCamera) {
    return (
      <Card className="relative overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-64 object-cover"
          style={{ backgroundColor: "#000" }}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Loading overlay */}
        {!isVideoReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75">
            <div className="text-white text-sm mb-2">
              {t("Starting camera...", "ক্যামেরা চালু হচ্ছে...")}
            </div>
            <div className="text-white text-xs opacity-75">
              {t("Please allow camera access", "ক্যামেরা অ্যাক্সেসের অনুমতি দিন")}
            </div>
          </div>
        )}

        {/* Camera controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4">
          <Button
            size="lg"
            onClick={capturePhoto}
            className="rounded-full w-16 h-16 p-0 bg-white text-black hover:bg-gray-100"
            disabled={!isVideoReady}
            aria-label={t("Capture photo", "ছবি তুলুন")}
          >
            <Camera className="h-6 w-6" />
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={stopCamera}
            className="rounded-full"
          >
            <X className="h-5 w-5 mr-2" />
            {t("Cancel", "বাতিল")}
          </Button>
        </div>
      </Card>
    );
  }

  // Main interface
  return (
    <div className="space-y-3">
      {preview ? (
        <Card className="relative overflow-hidden">
          <img src={preview} alt="Captured" className="w-full h-64 object-cover" />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={clearImage}
              aria-label={t("Retake photo", "পুনরায় ছবি তুলুন")}
              title={t("Retake photo", "পুনরায় ছবি তুলুন")}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={clearImage}
              aria-label={t("Remove image", "ছবি মুছুন")}
              title={t("Remove image", "ছবি মুছুন")}
            >
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
            <span className="text-sm font-medium">
              {t("Upload Photo", "ছবি আপলোড করুন")}
            </span>
          </Button>
        </div>
      )}

      {/* Error message */}
      {cameraError && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {t("Camera error: ", "ক্যামেরা ত্রুটি: ")}
          {cameraError}
        </div>
      )}

      {/* Hidden input for mobile camera fallback (file capture) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        aria-label={label || "Image upload"}
      />
    </div>
  );
}
