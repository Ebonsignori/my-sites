import { memo, useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";

function Tooltip({ customKey, children, text, noUnderline }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted) {
    return (
      <>
        <ReactTooltip
          wrapper="span"
          instanceId={customKey || text}
          id={customKey || text}
        >
          {text}
        </ReactTooltip>
        <TooltipWrapper
          data-tip
          data-for={customKey || text}
          noUnderline={noUnderline}
        >
          {children}
        </TooltipWrapper>
      </>
    );
  }

  return (
    <TooltipWrapper
      data-tip
      data-for={customKey || text}
      noUnderline={noUnderline}
    >
      {children}
    </TooltipWrapper>
  );
}

const ToolTipWrapperProps = (props) =>
  props.noUnderline &&
  `
  border-bottom: none;
`;
const TooltipWrapper = styled.span`
  border-bottom: 1px dotted var(--font-secondary);

  ${ToolTipWrapperProps}
`;

export default memo(Tooltip);
