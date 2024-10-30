"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useEffect, useState } from "react";

const NProgressWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {children}
      {mounted && (
        <ProgressBar
          height="2px"
          color="#ccc"
          options={{ showSpinner: false }}
          shallowRouting
        />
      )}
    </>
  );
};

export default NProgressWrapper;
