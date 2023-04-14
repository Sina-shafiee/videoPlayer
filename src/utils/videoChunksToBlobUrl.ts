/**
 * pass videoBlob and receive file and file url
 * @param videoBlob which are gonna converted to File and File url
 * @returns File and File url
 */

export const videoChunksToBlobUrl = (
  videoBlob: Blob
): Promise<{ videoUrl: string; videoFile: File }> => {
  return new Promise((resolve) => {
    const videoFile = new File([videoBlob], `${Date.now()}-video.webm`, {
      type: 'video/webm'
    });
    const videoUrl = URL.createObjectURL(videoFile);

    resolve({ videoUrl, videoFile });
  });
};
