import type { SVGProps } from "react";
const SvgOut = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="out_svg__a"
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
    <g mask="url(#out_svg__a)">
      <mask
        id="out_svg__b"
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
      <g mask="url(#out_svg__b)">
        <path
          fill="currentColor"
          d="M11.25 2.75a1.25 1.25 0 1 1 0 2.5h-3A2.75 2.75 0 0 0 5.5 8v8a2.75 2.75 0 0 0 2.75 2.75h3a1.25 1.25 0 1 1 0 2.5h-3A5.25 5.25 0 0 1 3 16V8c0-2.9 2.35-5.25 5.25-5.25z"
        />
        <mask
          id="out_svg__c"
          width={13}
          height={13}
          x={9}
          y={6}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "alpha",
          }}
        >
          <path fill="#D9D9D9" d="M9.25 6h12.728v12.728H9.25z" />
        </mask>
        <g mask="url(#out_svg__c)">
          <mask
            id="out_svg__d"
            width={13}
            height={13}
            x={9}
            y={6}
            maskUnits="userSpaceOnUse"
            style={{
              maskType: "alpha",
            }}
          >
            <path
              fill="#D9D9D9"
              stroke="currentColor"
              strokeWidth={0.5}
              d="M10.061 6.811h11.107v11.107H10.061z"
            />
          </mask>
          <g mask="url(#out_svg__d)">
            <path
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={0.5}
              d="M15.099 7.616a.9.9 0 0 1 1.296 0l3.977 4.092a.945.945 0 0 1 0 1.312l-3.977 4.092a.9.9 0 0 1-1.296 0 .945.945 0 0 1 0-1.313l2.45-2.521h-6.045a.914.914 0 0 1-.913-.914l.005-.093a.913.913 0 0 1 .908-.82h6.047L15.099 8.93a.945.945 0 0 1 0-1.313Z"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);
export default SvgOut;
