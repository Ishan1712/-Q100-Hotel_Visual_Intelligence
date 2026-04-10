"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Camera,
  Upload,
  X,
  Sparkles,
  ImageIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { compressImage, fileToBase64 } from "../lib/comparison";

interface CheckedItem {
  name: string;
  status: "present" | "missing";
}

interface AnalysisResult {
  status: "pass" | "fail";
  reason: string;
  items?: CheckedItem[];
  suggestion?: string;
  provider?: string;
}

export default function DemoPage() {
  const [masterImage, setMasterImage] = useState<string | null>(null);
  const [inspectionImage, setInspectionImage] = useState<string | null>(null);
  const [masterBase64, setMasterBase64] = useState<string>("");
  const [inspectionBase64, setInspectionBase64] = useState<string>("");
  const [description, setDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Camera state
  const [cameraOpen, setCameraOpen] = useState<"master" | "inspection" | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const masterInputRef = useRef<HTMLInputElement>(null);
  const inspectionInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    file: File,
    type: "master" | "inspection"
  ) => {
    const blobUrl = URL.createObjectURL(file);
    const base64 = await fileToBase64(blobUrl);

    if (type === "master") {
      setMasterImage(blobUrl);
      setMasterBase64(base64);
    } else {
      setInspectionImage(blobUrl);
      setInspectionBase64(base64);
    }
    setResult(null);
    setError(null);
  };

  const clearImage = (type: "master" | "inspection") => {
    if (type === "master") {
      setMasterImage(null);
      setMasterBase64("");
    } else {
      setInspectionImage(null);
      setInspectionBase64("");
    }
    setResult(null);
    setError(null);
  };

  // Camera functions
  const openCamera = useCallback(async (type: "master" | "inspection") => {
    setCameraOpen(type);
    setCameraReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch (err: any) {
      console.error("Camera error:", err);
      setError("Could not access camera. Please use Upload instead.");
      closeCamera();
    }
  }, []);

  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOpen(null);
    setCameraReady(false);
  }, []);

  const captureFromCamera = useCallback(async () => {
    if (!videoRef.current || !cameraOpen) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(videoRef.current, 0, 0);
    const dataURL = canvas.toDataURL("image/jpeg", 0.85);
    const base64 = await compressImage(dataURL);

    if (cameraOpen === "master") {
      setMasterImage(dataURL);
      setMasterBase64(base64);
    } else {
      setInspectionImage(dataURL);
      setInspectionBase64(base64);
    }
    setResult(null);
    setError(null);
    closeCamera();
  }, [cameraOpen, closeCamera]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const buildPrompt = (userDescription: string): string => {
    const desc = userDescription.trim();

    return `You are an expert visual comparison AI. You compare an 'Inspection Image' against a 'Master/Reference Image' to find discrepancies.

CONTEXT FROM USER: "${desc}"

Based on the user's description above, determine what items, arrangement, cleanliness, count, or positioning should be checked. Be thorough and strict.

RULES:
1. Compare ITEM PRESENCE — every item visible in the master must be in the inspection.
2. Compare ITEM COUNT — quantities must match.
3. Compare CLEANLINESS — no stains, smudges, dust, or debris.
4. Compare POSITIONING — items must be in the correct location and orientation as shown in master.
5. Compare CONDITION — no damage, tears, wrinkles, or wear.
6. Be STRICT — when in doubt, FAIL.

RESPONSE FORMAT (JSON only, no markdown):
{"status": "pass" | "fail", "reason": "concise 1-2 sentence explanation", "items": [{"name": "Item Name", "status": "present" | "missing"}], "suggestion": "friendly suggestion to fix issues, empty string if pass"}

IMPORTANT:
- The "items" array MUST list ALL individual items checked, each with "present" or "missing".
- Each item name should be a short label (2-4 words max).
- The "suggestion" should be a short, friendly instruction on how to fix issues. If status is "pass", set suggestion to "".

Compare the two images below. The first is the INSPECTION image. The second is the MASTER/REFERENCE image.

Return JSON only.`;
  };

  const runAnalysis = async () => {
    if (!masterBase64 || !inspectionBase64) {
      setError("Please upload both Master and Inspection images.");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a short description of what to inspect.");
      return;
    }

    setAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const prompt = buildPrompt(description);

      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          inspectionBase64,
          masterBase64,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `API returned ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const ImageUploadBox = ({
    type,
    image,
    onClear,
    inputRef,
  }: {
    type: "master" | "inspection";
    image: string | null;
    onClear: () => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
  }) => (
    <div className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden md:flex-1 md:min-h-0">
      <div className="px-4 md:px-5 py-3 md:py-3.5 shrink-0">
        <h3 className="text-sm font-semibold text-slate-700">
          {type === "master" ? "Master / Reference Image" : "Inspection Image"}
        </h3>
      </div>

      <div className="relative mx-2 mb-2 rounded-xl border-2 border-dashed border-slate-200 overflow-hidden bg-slate-50 h-64 md:h-auto md:flex-1 md:min-h-0">
        {image ? (
          <>
            <img
              src={image}
              alt={type}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button
              onClick={onClear}
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center shadow-md z-10 transition-colors"
            >
              <X size={16} className="text-slate-600" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <ImageIcon size={22} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500 text-center">
              {type === "master" ? "Upload Reference Image" : "Upload Inspection Image"}
            </p>
            <p className="text-xs text-slate-400 text-center">
              Capture or upload from device
            </p>
          </div>
        )}
      </div>

      <div className="px-2 pb-2 md:px-3 md:pb-3 flex gap-2 shrink-0">
        <button
          onClick={() => openCamera(type)}
          className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 active:scale-[0.97]"
        >
          <Camera size={14} />
          Capture
        </button>
        <button
          onClick={() => inputRef.current?.click()}
          className="flex-1 h-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 active:scale-[0.97]"
        >
          <Upload size={14} className="text-slate-400" />
          Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleImageUpload(e.target.files[0], type);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] min-h-[500px] md:min-h-[600px] bg-slate-50 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl font-sans border border-slate-100 flex flex-col relative">
      {/* Header */}
      <div className="px-4 md:px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight leading-none">
              AI Visual Comparison
            </h1>
            <span className="text-[8px] font-bold text-blue-600 uppercase tracking-widest">
              Real-time Demo
            </span>
          </div>
        </div>
      </div>

      {/* Content: stacked on mobile, 3 columns on desktop */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row p-3 md:px-6 md:py-4 gap-3 md:gap-5 overflow-y-auto md:overflow-hidden">
        {/* Column 1: Master Image */}
        <ImageUploadBox
          type="master"
          image={masterImage}
          onClear={() => clearImage("master")}
          inputRef={masterInputRef}
        />

        {/* Column 2: Inspection Image */}
        <ImageUploadBox
          type="inspection"
          image={inspectionImage}
          onClear={() => clearImage("inspection")}
          inputRef={inspectionInputRef}
        />

        {/* Column 3: Description + Results */}
        <div className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden md:flex-1 md:min-h-0">
          <div className="px-4 md:px-5 py-3 md:py-3.5 border-l-4 border-l-indigo-500 shrink-0">
            <h3 className="text-sm font-bold text-slate-800">
              AI Results &amp; Insights
            </h3>
          </div>

          <div className="flex-1 flex flex-col px-3 md:px-4 py-3 gap-3 overflow-y-auto">
            {/* Description input */}
            <div>
              <label className="block text-[10px] md:text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                What to inspect?
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Check if the bed has 4 pillows arranged properly with a bed runner centred..."
                className="w-full h-20 md:h-24 px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none placeholder:text-slate-300"
              />
            </div>

            {/* Analyze button */}
            <button
              onClick={runAnalysis}
              disabled={analyzing || !masterBase64 || !inspectionBase64 || !description.trim()}
              className={`w-full h-11 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shrink-0 active:scale-[0.97] ${
                analyzing || !masterBase64 || !inspectionBase64 || !description.trim()
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20"
              }`}
            >
              {analyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Start Analysis
                </>
              )}
            </button>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 px-3 md:px-4 py-2.5 md:py-3 bg-rose-50 border border-rose-200 rounded-xl">
                <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-rose-700">{error}</p>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="flex flex-col gap-2.5 md:gap-3">
                {/* Status banner */}
                <div
                  className={`flex items-start gap-2.5 px-3 md:px-4 py-3 rounded-xl border ${
                    result.status === "pass"
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-rose-50 border-rose-200"
                  }`}
                >
                  {result.status === "pass" ? (
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-sm font-semibold ${result.status === "pass" ? "text-emerald-700" : "text-rose-700"}`}>
                      {result.status === "pass" ? "Inspection Passed" : "Issues Found"}
                    </p>
                    <p className={`text-xs mt-1 leading-relaxed ${result.status === "pass" ? "text-emerald-600" : "text-rose-600"}`}>
                      {result.reason}
                    </p>
                  </div>
                </div>

                {/* Checked items */}
                {result.items && result.items.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Items Checked
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.items.map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border text-[10px] md:text-xs font-medium ${
                            item.status === "present"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-rose-50 border-rose-200 text-rose-700"
                          }`}
                        >
                          {item.status === "present" ? (
                            <CheckCircle2 size={11} className="shrink-0" />
                          ) : (
                            <XCircle size={11} className="shrink-0" />
                          )}
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestion */}
                {result.suggestion && (
                  <div className="flex items-start gap-2 px-3 md:px-4 py-2.5 md:py-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-sm md:text-base shrink-0">💡</span>
                    <p className="text-xs md:text-sm text-amber-800 leading-relaxed">
                      {result.suggestion}
                    </p>
                  </div>
                )}

                {/* Provider badge */}
                {result.provider && (
                  <div className="flex justify-end">
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md">
                      Powered by {result.provider === "google" ? "Gemini" : "GPT-4o"}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {!result && !error && !analyzing && (
              <div className="flex-1 flex items-center justify-center py-4 md:py-6">
                <p className="text-xs md:text-sm text-slate-400 text-center">
                  No AI result yet. Upload both images and click{" "}
                  <span className="font-semibold text-slate-600">Start Analysis</span> to begin.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Live Camera Overlay ===== */}
      {cameraOpen && (
        <div className="absolute inset-0 z-[500] bg-black flex flex-col animate-fade-in">
          {/* Camera header */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                {cameraOpen === "master" ? "Capture Master" : "Capture Inspection"}
              </span>
            </div>
            <button
              onClick={closeCamera}
              className="w-9 h-9 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Video feed */}
          <div className="flex-1 relative overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {!cameraReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-white/10 border-t-white/80 rounded-full animate-spin" />
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                  Opening Camera...
                </p>
              </div>
            )}

            {/* Viewfinder overlay */}
            {cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[85%] h-[70%] relative">
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-white/50 rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-white/50 rounded-tr-2xl" />
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-white/50 rounded-bl-2xl" />
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-white/50 rounded-br-2xl" />
                </div>
              </div>
            )}
          </div>

          {/* Capture button */}
          <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center pb-8 pt-6 bg-gradient-to-t from-black/70 to-transparent">
            <button
              onClick={captureFromCamera}
              disabled={!cameraReady}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white flex items-center justify-center transition-all active:scale-90 disabled:opacity-30"
            >
              <div className="w-12 h-12 md:w-15 md:h-15 rounded-full bg-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
