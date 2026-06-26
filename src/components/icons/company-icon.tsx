import type { SVGProps } from "react";
const SvgCompany = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="company__svg__a"
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
    <g mask="url(#company__svg__a)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M19 2a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-5v-3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zM5 13v2h2v-2zm6 0v2h2v-2zm6 0v2h2v-2zM5 9v2h2V9zm6 0v2h2V9zm6 0v2h2V9zM5 5v2h2V5zm6 0v2h2V5zm6 0v2h2V5z"
        clipRule="evenodd"
      />
    </g>
  </svg>
);
export default SvgCompany;
