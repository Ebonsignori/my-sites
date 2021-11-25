import Head from 'next/head'
import styled from "styled-components"

export default function Home() {
  return (
    <PageWrapper>
      <Head>
        <title>Evan Bonsignori</title>
        <meta name="description" content="About landing page for Evan Bonsignori" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Landing page!</h1>
    </PageWrapper>
  )
}

const PageWrapper = styled.div`
  background-color: black;
  color: white;
`
