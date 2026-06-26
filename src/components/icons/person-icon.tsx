import type { SVGProps } from "react";
const SvgPerson = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="person_svg__a"
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
    <g mask="url(#person_svg__a)">
      <mask
        id="person_svg__b"
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
      <g fill="currentColor" mask="url(#person_svg__b)">
        <path d="M3.5 18a6 6 0 0 1 6-6h5a6 6 0 0 1 6 6 4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4M16.5 6.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0" />
      </g>
    </g>
  </svg>
);
export default SvgPerson;
