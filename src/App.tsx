import { Fragment, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import VideoRecorder from './components/VideoRecorder';

const App = () => {
  useEffect(() => {
    const userAgent = navigator.userAgent;
    let isSafari: boolean;

    if (userAgent.match(/chrome|chromium|crios/i)) {
      isSafari = false;
    } else if (userAgent.match(/firefox|fxios/i)) {
      isSafari = false;
    } else if (userAgent.match(/safari/i)) {
      isSafari = false;
    } else if (userAgent.match(/opr\//i)) {
      isSafari = true;
    } else if (userAgent.match(/edg/i)) {
      isSafari = false;
    } else {
      isSafari = false;
    }

    console.log(isSafari);
  }, []);

  return (
    <Fragment>
      <VideoRecorder />
      <Toaster position='top-right' toastOptions={{ duration: 2000 }} />
    </Fragment>
  );
};

export default App;
