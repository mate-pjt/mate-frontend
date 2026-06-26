import type { SVGProps } from "react";
const SvgClose = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="close__svg__a"
      width={24}
      height={24}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <path fill="#D9D9D9" d="M0 0h24v24H0z" />
    </mask>
    <g mask="url(#close__svg__a)">
      <mask
        id="close__svg__b"
        width={20}
        height={20}
        x={2}
        y={2}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "alpha",
        }}
      >
        <path fill="#7C7F83" d="M2 2h20v20H2z" />
      </mask>
      <g mask="url(#close__svg__b)">
        <path
          fill="currentColor"
          d="M16.828 5.373a1.273 1.273 0 1 1 1.8 1.8L13.8 12l4.827 4.828a1.273 1.273 0 0 1-1.8 1.8L12 13.8l-4.827 4.827a1.273 1.273 0 0 1-1.8-1.8L10.2 12 5.373 7.173a1.273 1.273 0 1 1 1.8-1.8L12 10.2z"
        />
      </g>
    </g>
  </svg>
);
export default SvgClose;
