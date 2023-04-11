import { baseApi } from './index';

const uploadVideo = async (data: any, config: any): Promise<any> => {
  const res = await baseApi.post('/upload', data, config);
  return res.data;
};

export default uploadVideo;
