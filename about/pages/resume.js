// import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export default function Resume({ content }) {
  return (
    <PageWrapper>
      <ResumeHeader>
        <ResumeTitle content={content}>This is a WIP!</ResumeTitle>
      </ResumeHeader>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  padding: 0.2cm;
  page-break-after: always;
  width: 21cm;
  height: 29.7cm;
  border: 1px solid #cecece;
  background-color: #fff;
  margin-top: 50px;
  &:first-child {
    margin-top: 0;
  }
`;

const ResumeHeader = styled.div``;

const ResumeTitle = styled.h1`
  margin: 0;
`;
