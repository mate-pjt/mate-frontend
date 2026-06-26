import type { SVGProps } from "react";
const SvgCalender = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="calender__svg__a"
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
    <g mask="url(#calender__svg__a)">
      <mask
        id="calender__svg__b"
        width={20}
        height={20}
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
      <g mask="url(#calender__svg__b)">
        <path
          fill="currentColor"
          d="M17.5 2A1.5 1.5 0 0 1 19 3.5v.626c1.725.444 3 2.01 3 3.874v10a4 4 0 0 1-3.794 3.995L18 22H6l-.206-.005a4 4 0 0 1-3.79-3.789L2 18V8a4 4 0 0 1 3-3.874V3.5a1.5 1.5 0 0 1 3 0V4h8v-.5A1.5 1.5 0 0 1 17.5 2M4 10v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8z"
        />
      </g>
    </g>
  </svg>
);
export default SvgCalender;
