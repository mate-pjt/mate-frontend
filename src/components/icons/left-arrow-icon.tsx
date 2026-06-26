import type { SVGProps } from "react";
const SvgLeftarrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="leftarrow_svg__a"
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
    <g mask="url(#leftarrow_svg__a)">
      <mask
        id="leftarrow_svg__b"
        width={20}
        height={20}
        x={2}
        y={2}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "alpha",
        }}
      >
        <path fill="#D9D9D9" d="M2 2h20v20H2z" />
      </mask>
      <g mask="url(#leftarrow_svg__b)">
        <path
          fill="currentColor"
          d="M15.634 18.805a1.31 1.31 0 0 1 0 1.818 1.225 1.225 0 0 1-1.768 0l-7.5-7.714a1.31 1.31 0 0 1 0-1.818l7.5-7.714a1.225 1.225 0 0 1 1.768 0 1.31 1.31 0 0 1 0 1.818L9.018 12z"
        />
      </g>
    </g>
  </svg>
);
export default SvgLeftarrow;
