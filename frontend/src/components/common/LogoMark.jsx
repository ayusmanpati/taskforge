import React from "react";

export function LogoMark({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="7" fill="#18181b" />
      <rect
        x="5"
        y="12"
        width="4.5"
        height="11"
        rx="1.5"
        fill="white"
        opacity="0.45"
      />
      <rect
        x="11.75"
        y="7"
        width="4.5"
        height="16"
        rx="1.5"
        fill="white"
        opacity="0.9"
      />
      <rect x="18.5" y="10" width="4.5" height="13" rx="1.5" fill="#3b5bdb" />
    </svg>
  );
}
