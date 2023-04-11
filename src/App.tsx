import { Toaster } from 'react-hot-toast';
import VideoRecorder from './components/VideoRecorder';

const App = () => {
  return (
    <>
      <VideoRecorder />
      <Toaster position='top-right' toastOptions={{ duration: 2000 }} />
    </>
  );
};

export default App;
