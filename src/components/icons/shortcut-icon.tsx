import type { SVGProps } from "react";
const SvgShortcut = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="shortcut_svg__a"
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
    <g mask="url(#shortcut_svg__a)">
      <mask
        id="shortcut_svg__b"
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
      <g mask="url(#shortcut_svg__b)">
        <path
          fill="currentColor"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={0.5}
          d="M10 3a1 1 0 1 1 0 2H8a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-2a1 1 0 1 1 2 0v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5z"
        />
        <mask
          id="shortcut_svg__c"
          width={18}
          height={18}
          x={8}
          y={-2}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "alpha",
          }}
        >
          <path fill="#D9D9D9" d="m8 7 9-9 9 9-9 9z" />
        </mask>
        <g mask="url(#shortcut_svg__c)">
          <mask
            id="shortcut_svg__d"
            width={18}
            height={18}
            x={8}
            y={-2}
            maskUnits="userSpaceOnUse"
            style={{
              maskType: "alpha",
            }}
          >
            <path
              fill="#D9D9D9"
              stroke="currentColor"
              strokeWidth={0.5}
              d="M9.146 7 17-.854 24.854 7 17 14.854z"
            />
          </mask>
          <g mask="url(#shortcut_svg__d)">
            <path
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={0.5}
              d="M13.279 4.007a.9.9 0 0 1 .916-.916l5.706.08c.506.008.92.422.927.928l.081 5.706a.9.9 0 0 1-.916.916.945.945 0 0 1-.928-.928l-.05-3.515-4.275 4.274a.914.914 0 0 1-1.292 0l-.062-.07a.913.913 0 0 1 .063-1.221l4.275-4.276-3.517-.05a.945.945 0 0 1-.928-.928Z"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);
export default SvgShortcut;
