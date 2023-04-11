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
): Promise<{ videoUrl: string; videoBlob: Blob }> => {
  return new Promise((resolve) => {
    mediaRecorder.current!.addEventListener('stop', () => {
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);

      resolve({ videoUrl, videoBlob });
    });
  });
};
