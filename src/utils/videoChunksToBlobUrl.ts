import { MAC_MIME_TYPE, OTHER_OS_MIME_TYPE } from '../config/constants';

/**
 * pass videoBlob and receive file and file url
 * @param videoBlob which are gonna converted to File and File url
 * @returns File and File url
 */

export const videoChunksToBlobUrl = (
  videoBlob: Blob
): Promise<{ videoUrl: string; videoFile: File }> => {
  const userAgent = navigator.userAgent;
  let isMacOs: boolean;

  if (userAgent.indexOf('Mac') !== -1 || userAgent.indexOf('Ios') !== -1) {
    isMacOs = true;
  } else {
    isMacOs = false;
  }
  return new Promise((resolve) => {
    const videoFile = new File([videoBlob], `${Date.now()}-video.webm`, {
      type: isMacOs ? MAC_MIME_TYPE : OTHER_OS_MIME_TYPE
    });
    const videoUrl = URL.createObjectURL(videoFile);

    resolve({ videoUrl, videoFile });
  });
};
