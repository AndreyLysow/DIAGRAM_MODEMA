// pages/_app.js
import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';

function MyApp({ Component, pageProps }) {
  return (
    <ReactFlowProvider>
      <Component {...pageProps} />
    </ReactFlowProvider>
  );
}

export default MyApp;
