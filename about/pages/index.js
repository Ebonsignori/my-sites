import Head from 'next/head'
import Image from 'next/image'
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
      <Image src="/images/evan-profile.jpg" alt="Evan Bonsignori" width="640" height="640" />
    </PageWrapper>
  )
}

const PageWrapper = styled.div`
  background-color: black;
  color: white;
`
