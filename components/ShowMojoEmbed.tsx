"use client";

import Script from "next/script";

export default function ShowMojoEmbed() {
  return (
    <div className="w-full">
      {/* Load ShowMojo’s auto-resize helper */}
      <Script src="https://showmojo.com/iframe_v2.js" strategy="afterInteractive" />
      <iframe
        className="showmojo-listings"
        name="ShowMojoListingFrame"
        title="ShowMojo Listings"
        src="https://showmojo.com/981f1460d4/l"
        style={{ border: 0, width: "100%", height: "900px" }}
        scrolling="yes"
        loading="lazy"
        allowFullScreen
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
      />
    </div>
  );
}
