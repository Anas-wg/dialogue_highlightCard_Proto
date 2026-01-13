import { toPng } from 'html-to-image';
import { useCallback, useState } from 'react';

interface UseImageGeneratorReturn {
  isGenerating: boolean;
  generateImage: (element: HTMLElement) => Promise<string | null>;
  downloadImage: (dataUrl: string, filename: string) => void;
  downloadMultiple: (dataUrls: string[], filenamePrefix: string) => void;
}

export function useImageGenerator(): UseImageGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = useCallback(async (element: HTMLElement): Promise<string | null> => {
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 1,
      });
      return dataUrl;
    } catch (error) {
      console.error('Image generation failed:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const downloadImage = useCallback((dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }, []);

  const downloadMultiple = useCallback((dataUrls: string[], filenamePrefix: string) => {
    dataUrls.forEach((dataUrl, index) => {
      const link = document.createElement('a');
      link.download = `${filenamePrefix}_${index + 1}.png`;
      link.href = dataUrl;
      setTimeout(() => link.click(), index * 100);
    });
  }, []);

  return {
    isGenerating,
    generateImage,
    downloadImage,
    downloadMultiple,
  };
}
