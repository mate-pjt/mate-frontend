import type { SVGProps } from "react";
const SvgCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="check__svg__a"
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
    <g mask="url(#check__svg__a)">
      <mask
        id="check__svg__b"
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
      <g mask="url(#check__svg__b)">
        <path
          fill="currentColor"
          d="M18.61 6.622a1.25 1.25 0 0 1 1.78 1.756l-8.89 9a1.25 1.25 0 0 1-1.778 0L3.61 11.19a1.25 1.25 0 0 1 1.78-1.755l5.22 5.287z"
        />
      </g>
    </g>
  </svg>
);
export default SvgCheck;
