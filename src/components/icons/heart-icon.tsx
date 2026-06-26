import type { SVGProps } from "react";
const SvgHeart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="heart__svg__a"
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
    <g mask="url(#heart__svg__a)">
      <mask
        id="heart__svg__b"
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
      <g mask="url(#heart__svg__b)">
        <path
          fill="currentColor"
          d="M16.466 4a5.6 5.6 0 0 1 2.117.397 5.5 5.5 0 0 1 1.802 1.17 5.4 5.4 0 0 1 1.203 1.766 5.29 5.29 0 0 1-1.26 5.908l.001.001-7.66 7.474a1 1 0 0 1-1.396 0l-7.658-7.474A5.33 5.33 0 0 1 2 9.432c0-1.434.584-2.805 1.615-3.811a5.55 5.55 0 0 1 3.87-1.566c1.447 0 2.84.56 3.87 1.565l.617.6.617-.6a5.5 5.5 0 0 1 1.767-1.187A5.6 5.6 0 0 1 16.466 4"
        />
      </g>
    </g>
  </svg>
);
export default SvgHeart;
