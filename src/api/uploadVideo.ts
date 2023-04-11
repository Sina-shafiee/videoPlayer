import { AxiosRequestConfig } from 'axios';
import { baseApi } from './index';

/**
 *
 * @param data  formData which contains video
 * @param config axios request config check /src/components/videoRecorder.tsx file for more info
 * @returns
 */
const uploadVideo = async (
  data: FormData,
  config: AxiosRequestConfig<FormData>
): Promise<{
  address: string;
  message: string;
}> => {
  const res = await baseApi.post('/upload', data, config);
  return res.data;
};

export default uploadVideo;
