import type { SVGProps } from "react";
const SvgStorkeRighttarrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="storke_righttarrow_svg__a"
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
    <g mask="url(#storke_righttarrow_svg__a)">
      <mask
        id="storke_righttarrow_svg__b"
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
      <g mask="url(#storke_righttarrow_svg__b)">
        <path
          fill="currentColor"
          d="M11.366 3.376a1.226 1.226 0 0 1 1.768 0l7.5 7.715a1.31 1.31 0 0 1 0 1.818l-7.5 7.714a1.225 1.225 0 0 1-1.768 0 1.31 1.31 0 0 1 0-1.818l5.4-5.555H4.25a1.25 1.25 0 0 1 0-2.5h12.518l-5.402-5.555a1.31 1.31 0 0 1 0-1.819"
        />
      </g>
    </g>
  </svg>
);
export default SvgStorkeRighttarrow;
