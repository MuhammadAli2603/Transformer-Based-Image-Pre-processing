import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface QualityMetrics {
  sharpness: number;
  brightness: number;
  contrast: number;
  resolution_score: number;
}

export interface ImageDimensions {
  width: number;
  height: number;
  megapixels: number;
}

export interface QualityResult {
  filename: string;
  quality_score: number;
  category: 'bad' | 'normal' | 'high';
  metrics: QualityMetrics;
  dimensions: ImageDimensions;
  imageUrl?: string; // Client-side image preview URL
}

export interface BatchResult {
  results: QualityResult[];
  errors: Array<{ filename: string; error: string }>;
  total_processed: number;
  total_errors: number;
}

class ImageQualityAPI {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Classify a single image
   */
  async classifyImage(file: File, authToken: string): Promise<QualityResult> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${authToken}`,
    };

    try {
      const response = await axios.post<QualityResult>(
        `${this.baseURL}/classify-quality`,
        formData,
        { headers }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail || 'Failed to classify image';
        throw new Error(detail);
      }
      throw error;
    }
  }

  /**
   * Classify multiple images in batch
   */
  async classifyBatch(files: File[], authToken: string): Promise<BatchResult> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${authToken}`,
    };

    try {
      const response = await axios.post<BatchResult>(
        `${this.baseURL}/classify-batch`,
        formData,
        { headers }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail || 'Failed to classify images';
        throw new Error(detail);
      }
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; service: string }> {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      return response.data;
    } catch (error) {
      throw new Error('API health check failed');
    }
  }
}

export const imageQualityAPI = new ImageQualityAPI();
