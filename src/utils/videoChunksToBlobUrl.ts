import { mimeType } from '../config/constants';

/**
 *
 * @param mediaRecorder recorder instance
 * @param videoChunks which are gonna converted to Blob and Blob url
 * @returns File and File url
 */

export const videoChunksToBlobUrl = (
  mediaRecorder: MediaRecorder,
  videoChunks: Blob[]
): Promise<{ videoUrl: string; videoFile: File }> => {
  return new Promise((resolve) => {
    mediaRecorder.addEventListener('stop', () => {
      const videoFile = new File(videoChunks, `${Date.now()}-video.webm`, {
        type: mimeType
      });
      const videoUrl = URL.createObjectURL(videoFile);

      resolve({ videoUrl, videoFile });
    });
  });
};
