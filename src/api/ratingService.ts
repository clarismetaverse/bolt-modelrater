import { RatingResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export async function uploadImageForRating(imageFile: File): Promise<RatingResponse> {
  try {
    const formData = new FormData();
    formData.append('Picture', imageFile);

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      resp: data.resp
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}