import type { SVGProps } from "react";
const SvgSearch = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="search__svg__a"
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
    <g mask="url(#search__svg__a)">
      <mask
        id="search__svg__b"
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
      <g mask="url(#search__svg__b)">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M11 3a8 8 0 0 1 8 8c0 1.849-.63 3.549-1.683 4.903l2.89 2.89a1 1 0 1 1-1.414 1.414l-2.89-2.89A7.96 7.96 0 0 1 11 19a8 8 0 1 1 0-16m0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12"
          clipRule="evenodd"
        />
      </g>
    </g>
  </svg>
);
export default SvgSearch;
