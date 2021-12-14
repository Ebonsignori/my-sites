import { useContext, useRef } from "react";
import styled from "styled-components";

import { setEachBreakpoint } from "../../../shared/utils/breakpoints";
import AppContext from "../utils/app-context";
import detectOutsideClick from "../utils/outside-click";

export default function Modal({ modalContents }) {
  const appState = useContext(AppContext);
  const modalRef = useRef(null);
  const closeModal = () => appState.setModalContents(undefined);
  detectOutsideClick(modalRef, closeModal);
  return (
    <ModalWrapper isOpen={typeof modalContents !== "undefined"}>
      <ModalContainer ref={modalRef}>{modalContents}</ModalContainer>
    </ModalWrapper>
  );
}

const ModalWrapperProps = (props) =>
  props.isOpen &&
  `
  opacity: 1;
  visibility: visible;
`;
const ModalWrapper = styled.div`
  position: fixed;
  visibility: hidden;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  opacity: 0;
  transition: all 0.3s;
  ${ModalWrapperProps}
  max-height: 100vh;
  cursor: zoom-out;
`;

const ModalContainerBreakpoints = setEachBreakpoint({
  xs: `
  width: 100vw;
  `,
  sm: `
  width: 95vw;
  `,
  md: `
  width: 90vw;
  `,
  lg: `
  width: 75vw;
  `,
  xl: `
  width: 70vw;
  `,
  xxl: `
  width: 60vw;
  `,
});
const ModalContainer = styled.div`
  ${ModalContainerBreakpoints}
  cursor: default;
`;
