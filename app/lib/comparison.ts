/**
 * Comparison logic for AI-powered image analysis.
 * Handles calling the API route that proxies to OpenAI GPT-4o Vision.
 */

import { getComparisonPrompt } from './prompts';

export interface ComparisonResult {
  status: 'pass' | 'fail';
  reason: string;
}

/**
 * Converts a blob URL to a base64 string (without the data:... prefix).
 */
export async function fileToBase64(blobUrl: string): Promise<string> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const parts = base64.split(',');
      resolve(parts[1] || "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Converts a local image path (e.g. /master/01_Dustbin_master.png) to base64.
 */
export async function masterToBase64(path: string): Promise<string> {
  if (!path) return "";
  const res = await fetch(path);
  if (!res.ok) return "";
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const parts = base64.split(',');
      resolve(parts[1] || "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Sends inspection and master images to the server-side API route for
 * GPT-4o vision comparison. The API key is kept secure on the server.
 *
 * @param inspectionBase64 - Base64-encoded inspection image
 * @param masterBase64 - Base64-encoded master/reference image
 * @param checkpointName - Name of the checkpoint being verified
 * @param checkpointRef - Reference description for inspection criteria
 * @returns ComparisonResult with pass/fail status and reason
 */
export async function analyzeWithGPT4v(
  inspectionBase64: string,
  masterBase64: string,
  checkpointName: string,
  checkpointRef: string
): Promise<ComparisonResult> {
  const prompt = getComparisonPrompt(checkpointName, checkpointRef);

  try {
    const response = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        inspectionBase64,
        masterBase64,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    return data as ComparisonResult;
  } catch (e) {
    console.error('GPT Analysis Error:', e);
    return { status: 'fail', reason: 'AI Analysis failed to connect.' };
  }
}
