import { Fragment, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import VideoRecorder from './components/VideoRecorder';

const App = () => {
  useEffect(() => {
    const userAgent = navigator.userAgent;
    let browserName = userAgent.match(/safari/i) ? true : 'false';

    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = 'chrome';
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = 'firefox';
    } else if (userAgent.match(/safari/i)) {
      browserName = 'safari';
    } else if (userAgent.match(/opr\//i)) {
      browserName = 'opera';
    } else if (userAgent.match(/edg/i)) {
      browserName = 'edge';
    } else {
      browserName = 'No browser detection';
    }

    console.log(browserName);
  }, []);

  return (
    <Fragment>
      <VideoRecorder />
      <Toaster position='top-right' toastOptions={{ duration: 2000 }} />
    </Fragment>
  );
};

export default App;
