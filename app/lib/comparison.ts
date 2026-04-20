/**
 * Comparison logic for AI-powered image analysis.
 * Supports both Google Gemini and OpenAI GPT-4o Vision via toggle.
 */

import { getComparisonPrompt, getCustomMasterPrompt } from './prompts';

export type AIProvider = 'google' | 'openai';

export interface CheckedItem {
  name: string;
  status: 'present' | 'missing';
}

export interface ComparisonResult {
  status: 'pass' | 'fail';
  reason: string;
  items?: CheckedItem[];
  suggestion?: string;
}

/**
 * Resizes and compresses an image from a blob URL, path, or dataURL.
 * Returns a base64 string (without the data:image/jpeg;base64, prefix).
 */
export async function compressImage(source: string, maxDim: number = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDim) {
          height *= maxDim / width;
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width *= maxDim / height;
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      // Export as JPEG with 0.8 quality for good balance of size/quality
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const base64 = dataUrl.split(',')[1];
      resolve(base64);
    };
    img.onerror = (e) => reject(e);
    img.src = source;
  });
}

/**
 * Converts a blob URL to a compressed base64 string.
 */
export async function fileToBase64(blobUrl: string): Promise<string> {
  try {
    return await compressImage(blobUrl);
  } catch (e) {
    console.error('Compression error (blob):', e);
    // Fallback to original method if compression fails
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1] || "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

/**
 * Converts a local image path to a compressed base64 string.
 */
export async function masterToBase64(path: string): Promise<string> {
  if (!path) return "";
  try {
    return await compressImage(path);
  } catch (e) {
    console.error('Compression error (master):', e);
    // Fallback
    const res = await fetch(path);
    if (!res.ok) return "";
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1] || "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

/**
 * Sends inspection and master images to the server-side API route for
 * AI vision comparison (Google Gemini or OpenAI GPT-4o).
 *
 * @param inspectionBase64 - Base64-encoded inspection image
 * @param masterBase64 - Base64-encoded master/reference image
 * @param checkpointName - Name of the checkpoint being verified
 * @param checkpointRef - Reference description for inspection criteria
 * @param provider - AI provider to use ('google' or 'openai')
 * @returns ComparisonResult with pass/fail status and reason
 */
export async function analyzeWithGPT4v(
  inspectionBase64: string,
  masterBase64: string,
  checkpointName: string,
  checkpointRef: string,
  provider?: AIProvider,
  useCustomMasterPrompt?: boolean
): Promise<ComparisonResult> {
  const prompt = useCustomMasterPrompt
    ? getCustomMasterPrompt()
    : getComparisonPrompt(checkpointName, checkpointRef);

  try {
    const response = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        inspectionBase64,
        masterBase64,
        provider,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    return data as ComparisonResult;
  } catch (e) {
    console.error('AI Analysis Error:', e);
    return { status: 'fail', reason: 'AI Analysis failed to connect.' };
  }
}
