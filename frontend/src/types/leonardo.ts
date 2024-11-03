export interface ImageGeneration {
  id: string;
  status: string;
  imageUrl: string;
  prompt: string;
}

export interface GenerationResponse {
  generations: ImageGeneration[];
} 