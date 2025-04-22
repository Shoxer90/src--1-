import React, { useEffect, useRef } from 'react';

function IframeHtmlRenderer({ htmlContent }) {

  const iframeRef = useRef(null);

  useEffect(() => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    if (iframeRef.current) {
      iframeRef.current.src = url;
    }

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [htmlContent]);

  return (
    <iframe
      ref={iframeRef}
      style={{ width: '100%', height: '100dvh', border: 'none' }}
    />
  );
}

export default IframeHtmlRenderer;
