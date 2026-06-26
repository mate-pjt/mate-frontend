import type { SVGProps } from "react";
const SvgShare = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="share__svg__a"
      width={24}
      height={24}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <path fill="#484A4C" d="M0 0h24v24H0z" />
    </mask>
    <g mask="url(#share__svg__a)">
      <mask
        id="share__svg__b"
        width={20}
        height={21}
        x={2}
        y={2}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "alpha",
        }}
      >
        <path fill="#484A4C" d="M2 2h20v20H2z" />
        <path fill="#484A4C" d="M2 2h20v20H2z" />
      </mask>
      <g fill="currentColor" mask="url(#share__svg__b)">
        <circle cx={5.5} cy={12} r={3.5} />
        <path d="M16.5 7.459 8 12.366l-1-1.732 8.5-4.908z" />
        <path d="m17.5 17.485-1 1.732L7 13.732 8 12z" />
        <circle cx={18.5} cy={5.5} r={3.5} />
        <circle cx={18.5} cy={18.5} r={3.5} />
      </g>
    </g>
  </svg>
);
export default SvgShare;
