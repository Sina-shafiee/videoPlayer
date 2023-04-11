import type { MutableRefObject } from 'react';
import { mimeType } from '../config/constants';

/**
 *
 * @param mediaRecorder recorder instance
 * @param videoChunks which are gonna converted to Blob and Blob url
 * @returns Blob and blob url
 */

export const videoChunksToBlobUrl = (
  mediaRecorder: MutableRefObject<MediaRecorder | null>,
  videoChunks: Blob[]
): Promise<{ videoUrl: string; videoFile: File }> => {
  return new Promise((resolve) => {
    mediaRecorder.current!.addEventListener('stop', () => {
      const videoFile = new File(videoChunks, `${Date.now()}+video.webm`, {
        type: mimeType
      });
      const videoUrl = URL.createObjectURL(videoFile);

      resolve({ videoUrl, videoFile });
    });
  });
};
