"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Footer() {
  const { data: settings, error } = useSWR("/api/settings/app", fetcher);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Return null while loading or if hidden/error
  // (Note: Ideally, you might want a skeleton loader here instead of null to prevent layout shifts)
  if (!settings || !settings.showFooter || error) {
    return null;
  }

  return (
    <footer
      className={`
                w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
                transition-opacity duration-300 z-50
                ${isVisible ? "opacity-100" : "opacity-0"}
            `}
    >
      <div className="container mx-auto px-4 py-6 md:py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 text-sm text-muted-foreground">
          {/* Left Side: App Name & Version */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-semibold text-foreground tracking-tight">
              {settings.appName}
            </span>
            {settings.appVersion && (
              <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
                v{settings.appVersion}
              </span>
            )}
          </div>

          {/* Right Side: Links/Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center md:text-right">
            {settings.footerText && (
              <span className="leading-tight">{settings.footerText}</span>
            )}

            {/* Divider - Hidden on mobile, visible on small tablets and up */}
            {settings.footerText && settings.footerCopyright && (
              <span className="hidden sm:inline-block text-muted-foreground/40">
                |
              </span>
            )}

            {settings.footerCopyright && (
              <span className="opacity-80">{settings.footerCopyright}</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
