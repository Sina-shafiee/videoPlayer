import { Fragment, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import VideoRecorder from './components/VideoRecorder';

const App = () => {
  useEffect(() => {
    const userAgent = navigator.userAgent;
    let isMacOs: boolean;

    if (userAgent.indexOf('Mac') !== -1 || userAgent.indexOf('Ios') !== -1) {
      isMacOs = true;
    } else {
      isMacOs = false;
    }

    console.log(isMacOs);
  }, []);

  return (
    <Fragment>
      <VideoRecorder />
      <Toaster position='top-right' toastOptions={{ duration: 2000 }} />
    </Fragment>
  );
};

export default App;
