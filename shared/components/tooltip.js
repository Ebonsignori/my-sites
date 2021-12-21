import { useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { setEachBreakpoint } from "../utils/breakpoints";

function Tooltip({ children, text, linkUrl, color, linkOnClick, isIcon }) {
  const textRef = useRef(null);

  if (typeof linkUrl !== "undefined") {
    isIcon = true;
  }
  // Hover used to force render to check if offscreen
  const [isHovered, setIsHovered] = useState(false);

  // Detect if hover text goes offscreen. If it does, add a margin to correct it
  const textProps = useMemo(() => {
    let result = "";
    if (textRef && textRef.current) {
      const out = isOutOfViewport(textRef.current);
      if (out.left) {
        result = `
      margin-left: ${out.leftOffset + 7}px;
      ${isHovered ? "" : "color: var(--background);"}
      `;
      } else if (out.right) {
        result = `
      margin-right: ${out.rightOffset + 7}px;
      `;
      }
    }
    return result;
  }, [isHovered, textRef]);

  let TooltipComponent = styled.span``;
  if (typeof linkUrl !== "undefined") {
    // eslint-disable-next-line no-use-before-define
    TooltipComponent = IconLink;
  }

  return (
    <TooltipWrapper
      onMouseEnter={() => (isHovered ? "" : setIsHovered(true))}
      onMouseLeave={() => (isHovered ? setIsHovered(false) : "")}
      key={text}
      isIcon={isIcon}
      onClick={linkOnClick}
    >
      <TooltipComponent
        id="tooltip-component"
        instanceId="tooltip-component"
        className="tooltip"
        color={color}
        href={linkUrl ? linkUrl : undefined}
      >
        <span className="tooltip-text" ref={textRef}>
          <ToolTipText textProps={textProps}>{text}</ToolTipText>
        </span>
        {children}
      </TooltipComponent>
    </TooltipWrapper>
  );
}

// From: https://gomakethings.com/how-to-check-if-any-part-of-an-element-is-out-of-the-viewport-with-vanilla-js/
function isOutOfViewport(elem) {
  // Get element's bounding
  const bounding = elem.getBoundingClientRect();

  // Check if it's out of the viewport on each side
  const out = {};
  out.left = bounding.left < 0;
  out.leftOffset = Math.abs(bounding.left);
  out.right =
    bounding.right >
    (window.innerWidth || document.documentElement.clientWidth);
  out.rightOffset = bounding.right - window.innerWidth;

  return out;
}

const TooltipWrapperBreakpoints = setEachBreakpoint({
  xl: `
  top: -66px;
  `,
  xxl: `
  top: -66px;
  `,
});
const ToolTipWrapperProps = (props) =>
  props.isIcon &&
  `
  border-bottom: none;
`;
const TooltipWrapper = styled.aside`
  .tooltip .tooltip-text {
    ${TooltipWrapperBreakpoints}
  }
  display: inline-block !important;
  border-bottom: 1px dotted var(--font-secondary);

  ${ToolTipWrapperProps}
`;

const ToolTipText = styled.label`
  ${(props) => props.textProps}
`;

const IconLinkBreakpoints = setEachBreakpoint({
  xs: `
  margin: 0 2vw;
  margin-bottom: 1%;
  svg {
    width: 5.2vw;
    height: 5.2vw;
  }
  `,
  sm: `
  margin: 0 1.1vw;
  svg {
    width: 4vw;
    height: 4vw;
  }
  `,
  md: `
  margin: 0 1vw;
  svg {
    width: 3.0vw;
    height: 3.0vw;
  }
  `,
  lg: `
  svg {
    width: 2.0vw;
    height: 2.0vw;
  }
  `,
  xxl: `
  svg {
    width: 1.5vw;
    height: 1.5vw;
  }
  `,
});
const IconLink = styled.a`
  margin-right: 1vw;
  svg {
    width: 1.7vw;
    height: 1.7vw;
    fill: var(--font);
    :hover {
      fill: ${(props) => props.color};
    }
  }
  ${IconLinkBreakpoints}
`;

export default Tooltip;
