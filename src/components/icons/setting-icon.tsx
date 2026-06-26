import type { SVGProps } from "react";
const SvgSetting = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="setting__svg__a"
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
    <g mask="url(#setting__svg__a)">
      <mask
        id="setting__svg__b"
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
      <g fill="currentColor" mask="url(#setting__svg__b)">
        <path
          fillRule="evenodd"
          d="M13.03 2c.987 0 1.822.73 1.952 1.709l.005.036c.091.683.558 1.25 1.155 1.596.596.345 1.314.462 1.952.199l.034-.015a1.97 1.97 0 0 1 2.456.836l.737 1.277a1.97 1.97 0 0 1-.505 2.546l-.027.021c-.547.42-.804 1.105-.804 1.795s.257 1.373.803 1.794l.028.021a1.97 1.97 0 0 1 .505 2.547l-.737 1.277a1.97 1.97 0 0 1-2.456.835l-.034-.014c-.638-.263-1.356-.146-1.952.2-.597.345-1.064.91-1.155 1.594l-.005.037A1.97 1.97 0 0 1 13.03 22h-1.474a1.97 1.97 0 0 1-1.953-1.709l-.005-.038c-.092-.683-.559-1.249-1.155-1.594-.597-.345-1.314-.462-1.952-.199l-.034.015a1.97 1.97 0 0 1-2.456-.836l-.736-1.277a1.97 1.97 0 0 1 .504-2.547l.028-.021c.546-.42.804-1.104.804-1.794s-.258-1.374-.805-1.795l-.027-.021a1.97 1.97 0 0 1-.505-2.545L4 6.36a1.97 1.97 0 0 1 2.456-.836l.034.014c.638.263 1.355.147 1.952-.2.597-.344 1.063-.91 1.155-1.593l.005-.037A1.97 1.97 0 0 1 11.555 2zm-.737 5.385a4.615 4.615 0 1 0 0 9.23 4.615 4.615 0 0 0 0-9.23"
          clipRule="evenodd"
        />
        <path d="M15.37 12a3.077 3.077 0 1 1-6.154 0 3.077 3.077 0 0 1 6.154 0" />
      </g>
    </g>
  </svg>
);
export default SvgSetting;
