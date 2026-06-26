import type { SVGProps } from "react";
const SvgReset = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="reset__svg__a"
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
    <g fill="currentColor" mask="url(#reset__svg__a)">
      <path d="M19.438 10.945c.586 0 1.062.472 1.062 1.055 0 3.498-2.854 6.334-6.375 6.334h-2.748l1.374 1.364a1.05 1.05 0 0 1 0 1.493 1.067 1.067 0 0 1-1.502 0L8.06 18.024a1.05 1.05 0 0 1 0-1.492l3.188-3.167a1.067 1.067 0 0 1 1.502 0 1.05 1.05 0 0 1 0 1.492l-1.374 1.365h2.748c2.347 0 4.25-1.89 4.25-4.222 0-.583.476-1.056 1.063-1.056M11.249 2.81a1.067 1.067 0 0 1 1.502 0l3.188 3.166a1.05 1.05 0 0 1 0 1.493l-3.188 3.166a1.067 1.067 0 0 1-1.502 0 1.05 1.05 0 0 1 0-1.492l1.374-1.365H9.875c-2.347 0-4.25 1.89-4.25 4.222a1.06 1.06 0 0 1-1.062 1.056A1.06 1.06 0 0 1 3.5 12c0-3.498 2.854-6.333 6.375-6.333h2.748l-1.374-1.365a1.05 1.05 0 0 1 0-1.493" />
    </g>
  </svg>
);
export default SvgReset;
