import type { SVGProps } from "react";
const SvgClip = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="clip__svg__a"
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
    <g mask="url(#clip__svg__a)">
      <mask
        id="clip__svg__b"
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
      <g mask="url(#clip__svg__b)">
        <path
          fill="currentColor"
          d="M12.223 4.296a5.708 5.708 0 0 1 8.072 8.073l-6.942 6.942a.913.913 0 1 1-1.292-1.291l6.943-6.943a3.882 3.882 0 0 0-5.49-5.489l-8.557 8.557a2.283 2.283 0 0 0 3.23 3.23L16.42 9.14a.685.685 0 0 0-.968-.969L10.124 13.5a.913.913 0 1 1-1.292-1.291L14.16 6.88a2.512 2.512 0 1 1 3.552 3.552l-8.234 8.234a4.11 4.11 0 0 1-5.812-5.813z"
        />
      </g>
    </g>
  </svg>
);
export default SvgClip;
