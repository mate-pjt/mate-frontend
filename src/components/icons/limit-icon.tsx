import type { SVGProps } from "react";
const SvgLimit = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="limit_svg__a"
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
    <g mask="url(#limit_svg__a)">
      <mask
        id="limit_svg__b"
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
      <g mask="url(#limit_svg__b)">
        <path
          fill="currentColor"
          d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m.008 5.078a.97.97 0 0 0-.972.973v4.375c0 .347.185.668.486.842l3.89 2.246.087.044a.973.973 0 0 0 .968-1.675l-.084-.054-3.402-1.966V8.051a.973.973 0 0 0-.973-.973"
        />
      </g>
    </g>
  </svg>
);
export default SvgLimit;
