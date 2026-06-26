import type { SVGProps } from "react";
const SvgInfo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="info__svg__a"
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
    <g mask="url(#info__svg__a)">
      <mask
        id="info__svg__b"
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
      <g mask="url(#info__svg__b)">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m0 13.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2M12 6a1 1 0 0 0-1 1v6.5a1 1 0 1 0 2 0V7a1 1 0 0 0-1-1"
          clipRule="evenodd"
        />
      </g>
    </g>
  </svg>
);
export default SvgInfo;
