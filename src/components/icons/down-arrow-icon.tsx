import type { SVGProps } from "react";
const SvgDownarrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="downarrow_svg__a"
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
    <g mask="url(#downarrow_svg__a)">
      <mask
        id="downarrow_svg__b"
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
      <g mask="url(#downarrow_svg__b)">
        <path
          fill="currentColor"
          d="M18.805 7.366a1.31 1.31 0 0 1 1.818 0c.502.488.502 1.28 0 1.768l-7.714 7.5a1.31 1.31 0 0 1-1.818 0l-7.714-7.5a1.225 1.225 0 0 1 0-1.768 1.31 1.31 0 0 1 1.818 0L12 13.983z"
        />
      </g>
    </g>
  </svg>
);
export default SvgDownarrow;
