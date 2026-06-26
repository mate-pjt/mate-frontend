import type { SVGProps } from "react";
const SvgAdd = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="add__svg__a"
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
    <g mask="url(#add__svg__a)">
      <mask
        id="add__svg__b"
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
      <g mask="url(#add__svg__b)">
        <path
          fill="currentColor"
          d="M20.1 10.727a1.272 1.272 0 1 1 0 2.546h-6.827V20.1a1.273 1.273 0 1 1-2.546 0v-6.827H3.9a1.273 1.273 0 0 1 0-2.546h6.827V3.9a1.273 1.273 0 1 1 2.546 0v6.827z"
        />
      </g>
    </g>
  </svg>
);
export default SvgAdd;
