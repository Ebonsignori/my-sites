import Head from 'next/head'
import NextImage from 'next/image'
import styled from "styled-components"

export default function Image({ src, alt, width, height }) {
  let loader;
  if (process.env.NODE_ENV !== "development") {
    loader = ({ src, width, quality }) => {
      return `https://ebonsignori.github.io/my-about/images/${src}`
    }
  }

  return (
    <NextImage loader={loader} src={src} alt={alt} width={width} height={height} />
  )
}

