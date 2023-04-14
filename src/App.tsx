import { Fragment, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import VideoRecorder from './components/VideoRecorder';

const App = () => {
  return (
    <Fragment>
      <VideoRecorder />
      <Toaster position='top-right' toastOptions={{ duration: 2000 }} />
    </Fragment>
  );
};

export default App;
