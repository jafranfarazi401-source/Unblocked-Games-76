import React from 'react';

const AdBanner = () => {
  const adContent = `
    <html>
      <body style="margin: 0; padding: 0; overflow: hidden;">
        <script type="text/javascript">
          // Fix for "Cannot set property fetch of #<Window> which has only a getter"
          try {
            if (window.fetch && (Object.getOwnPropertyDescriptor(window, 'fetch') || {}).get) {
              const originalFetch = window.fetch;
              Object.defineProperty(window, 'fetch', {
                value: originalFetch,
                writable: true,
                configurable: true
              });
            }
          } catch (e) {
            console.error('Failed to patch fetch:', e);
          }

          atOptions = {
            'key' : 'b5db419380bcec72a0ea8fc0440e63b5',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/b5db419380bcec72a0ea8fc0440e63b5/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="w-[320px] h-[50px] bg-black/5 border border-black/10 rounded-lg flex items-center justify-center overflow-hidden glass">
      <iframe
        srcDoc={adContent}
        width="320"
        height="50"
        frameBorder="0"
        scrolling="no"
        title="Ad"
        className="w-full h-full"
      />
    </div>
  );
};

export default AdBanner;
