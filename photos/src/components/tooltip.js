import styled from "styled-components";

import { setEachBreakpoint } from "../../../shared/utils/breakpoints";

export default function Tooltip({ children, text }) {
  return (
    <TooltipWrapper>
      <span className="tooltip">
        <span className="tooltip-text">{text}</span>
        {children}
      </span>
    </TooltipWrapper>
  );
}

const TooltipWrapperBreakpoints = setEachBreakpoint({
  xl: `
  top: -66px;
  `,
  xxl: `
  top: -66px;
  `,
});
const TooltipWrapper = styled.span`
  .tooltip .tooltip-text {
    ${TooltipWrapperBreakpoints}
  }
  display: inline-block !important;
  border-bottom: 1px dotted var(--font-secondary);
`;
