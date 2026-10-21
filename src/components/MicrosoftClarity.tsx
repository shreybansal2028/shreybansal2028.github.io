'use client'

import Script from 'next/script'

export function MicrosoftClarity() {
  // Support environment variable or default fallback ID
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

  if (!clarityId) {
    // If not configured yet, do not inject to avoid 404 tag errors
    return null
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `,
      }}
    />
  )
}
