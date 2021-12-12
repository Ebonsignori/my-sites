import "bootstrap/dist/css/bootstrap.min.css";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import styled from "styled-components";

import { AboutLink, Title } from "../src/components/heading";
import { SERVER_URL } from "../src/utils/misc";

async function getCatalogue(bucket, setCatalogue, context) {
  const { setSuccessMsg, setErrorMsg } = context;
  setSuccessMsg("");
  setErrorMsg("");
  const rawRes = await fetch(`${SERVER_URL}/catalogue/${bucket}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  let res;
  try {
    res = await rawRes.json();
  } catch (error) {
    return setErrorMsg(error.message);
  }
  if (res.error) {
    setErrorMsg(res.error);
  } else if (res.success) {
    setSuccessMsg(res.success);
  }
  setCatalogue(res);
  return "Updated Catalogue";
}

async function updateCatalogue(bucket, catalogue, context) {
  const { setSuccessMsg, setErrorMsg } = context;
  setSuccessMsg("");
  setErrorMsg("");
  const rawRes = await fetch(`${SERVER_URL}/catalogue/${bucket}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(catalogue),
  });
  let res;
  try {
    res = await rawRes.json();
  } catch (error) {
    return setErrorMsg(error.message);
  }
  if (res.error) {
    setErrorMsg(res.error);
  } else if (res.success) {
    setSuccessMsg(res.success);
  }
}

export default function Catalogue() {
  const [catalogue, setCatalogue] = useState({});
  const [bucket, setBucket] = useState(process.env.BUCKET_NAME);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const context = {
    setSuccessMsg,
    setErrorMsg,
  };

  useEffect(() => {
    getCatalogue(bucket, setCatalogue, context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper>
      <Container>
        <Title className="mt-4">Catalogue Editor</Title>
        <Link href="/" passHref>
          <AboutLink className="mt-4">Image uploader</AboutLink>
        </Link>
        <Form.Group className="mt-3">
          <Form.Label>S3 Bucket Name</Form.Label>
          <Form.Control
            type="text"
            value={bucket}
            onChange={(e) => setBucket(e.target.value)}
          />
        </Form.Group>
        <Button
          className="mt-3 mb-3"
          variant="secondary"
          onClick={async () => {
            const res = await getCatalogue(bucket, setCatalogue, context);
            setSuccessMsg(res);
          }}
        >
          Update catalogue from bucket
        </Button>
        <JsonWrapper>
          <JSONInput
            id="a_unique_id"
            placeholder={catalogue}
            onChange={(value) => {
              // Reset messages on json edit
              if (successMsg) {
                setSuccessMsg("");
              }
              if (errorMsg) {
                setErrorMsg("");
              }
              setCatalogue(value.jsObject, context);
            }}
            locale={locale}
            height="100%"
            width="100%"
          />
        </JsonWrapper>

        <Button
          className="mt-3 mb-3"
          variant="primary"
          onClick={async () => {
            await updateCatalogue(bucket, catalogue, context);
          }}
        >
          Set as S3 catalogue
        </Button>
        {errorMsg && (
          <Form.Group className="mt-3">
            <FormErrors>{errorMsg}</FormErrors>
          </Form.Group>
        )}
        {successMsg && (
          <Form.Group className="mt-3">
            <FormSuccess>{successMsg}</FormSuccess>
          </Form.Group>
        )}
      </Container>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  position: relative;
  max-height: 100vh;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100vw;
  max-width: 100vw;
`;

const JsonWrapper = styled.div`
  border: 1px solid orange;
`;

const FormErrors = styled.span`
  color: red;
`;
const FormSuccess = styled.span`
  color: green;
`;
