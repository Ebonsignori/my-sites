import { memo } from "react";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";

function Tooltip({ key, children, text, noUnderline }) {
  return (
    <>
      <ReactTooltip id={key || text}>{text}</ReactTooltip>
      <TooltipWrapper data-tip data-for={key || text} noUnderline={noUnderline}>
        {children}
      </TooltipWrapper>
    </>
  );
}

const ToolTipWrapperProps = (props) =>
  props.noUnderline &&
  `
  border-bottom: none;
`;
const TooltipWrapper = styled.div`
  display: inline-block !important;
  border-bottom: 1px dotted var(--font-secondary);

  ${ToolTipWrapperProps}
`;

export default memo(Tooltip);
