import "bootstrap/dist/css/bootstrap.min.css";
import "@uiw/react-textarea-code-editor/dist.css";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import styled from "styled-components";

import Header from "../../shared/components/header";
import { SERVER_URL } from "../src/utils/misc";

const CodeEditor = dynamic(
  // eslint-disable-next-line github/no-then
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);

async function getCatalogue(bucket, setCatalogue, context) {
  const { setSuccessMsg, setErrorMsg, setShowToast } = context;
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
    setShowToast(true);
    setErrorMsg(res.error);
  } else if (res.success) {
    setShowToast(true);
    setSuccessMsg(res.success);
  }
  setCatalogue(JSON.stringify(res, null, 2));
  return "Updated Catalogue";
}

async function updateCatalogue(bucket, catalogue, context) {
  const { setSuccessMsg, setErrorMsg, setShowToast } = context;
  setSuccessMsg("");
  setErrorMsg("");
  const rawRes = await fetch(`${SERVER_URL}/catalogue/${bucket}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: catalogue,
  });
  let res;
  try {
    res = await rawRes.json();
  } catch (error) {
    return setErrorMsg(error.message);
  }
  if (res.error) {
    setShowToast(true);
    setErrorMsg(res.error);
  } else if (res.success) {
    setShowToast(true);
    setSuccessMsg(res.success);
  }
}

async function syncCatalogue(bucket, context) {
  const { setSuccessMsg, setErrorMsg, setShowToast } = context;
  setSuccessMsg("");
  setErrorMsg("");
  const rawRes = await fetch(`${SERVER_URL}/catalogue/${bucket}/sync`, {
    method: "PUT",
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
    setShowToast(true);
    setErrorMsg(res.error);
  } else if (res.success) {
    setShowToast(true);
    setSuccessMsg(res.success);
  }
  return res.catalogue;
}

async function deleteFromCatalogue(bucket, slug, context) {
  const { setSuccessMsg, setErrorMsg, setShowToast } = context;
  setSuccessMsg("");
  setErrorMsg("");
  const rawRes = await fetch(`${SERVER_URL}/catalogue/${bucket}/${slug}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  let res;
  try {
    res = await rawRes.json();
  } catch (error) {
    setShowToast(true);
    return setErrorMsg(error.message);
  }
  if (res.error) {
    setErrorMsg(res.error);
    setShowToast(true);
  } else if (res.success) {
    setSuccessMsg(res.success);
    setShowToast(true);
  }
  return res.catalogue;
}

export default function Catalogue() {
  const headerRef = useRef(null);
  const [catalogue, setCatalogue] = useState("");
  const [bucket, setBucket] = useState(process.env.BUCKET_NAME);
  const [deleteSlug, setDeleteSlug] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showToast, rawSetShowToast] = useState(false);

  const context = {
    setSuccessMsg,
    setErrorMsg,
    setShowToast: (value) => {
      if (value) {
        headerRef.current.scrollTo(0, 0);
      }
      rawSetShowToast(value);
    },
  };

  useEffect(() => {
    getCatalogue(bucket, setCatalogue, context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper ref={headerRef}>
      <ToastContainer position="top-center" className="mt-3">
        <Toast
          autohide
          delay={3000}
          show={showToast}
          onClose={() => rawSetShowToast(false)}
        >
          <Toast.Header>
            <strong className="me-auto">
              {successMsg && <FormSuccess>{successMsg}</FormSuccess>}
              {errorMsg && <FormErrors>{errorMsg}</FormErrors>}
            </strong>
          </Toast.Header>
        </Toast>
      </ToastContainer>
      <Container>
        <Header
          title="Uploader"
          titleUrl="/"
          subtitle="Images to S3"
          navLinks={[{ url: "", name: "Catalogue Manager", active: true }]}
        />
        <Form.Group className="mt-3">
          <Form.Label>S3 Bucket Name</Form.Label>
          <Form.Control
            type="text"
            value={bucket}
            onChange={(e) => setBucket(e.target.value)}
          />
        </Form.Group>
        <Button
          className="mt-3"
          variant="secondary"
          onClick={async () => {
            const res = await getCatalogue(bucket, setCatalogue, context);
            setSuccessMsg(res);
          }}
        >
          Update catalogue from bucket
        </Button>
        <br />
        <Button
          className="mt-2 mb-3 ml-3"
          variant="secondary"
          onClick={async () => {
            const syncedCatalogue = await syncCatalogue(bucket, context);
            setCatalogue(JSON.stringify(syncedCatalogue, null, 2));
          }}
        >
          Sync catalogue tags and models
        </Button>
        <Form.Group className="mt-3">
          <Form.Label>Delete by Slug</Form.Label>
          <Form.Control
            type="text"
            value={deleteSlug}
            onChange={(e) => setDeleteSlug(e.target.value)}
          />
        </Form.Group>
        <Button
          className="mt-3 mb-3"
          variant="secondary"
          onClick={async () => {
            const updatedCatalogue = await deleteFromCatalogue(
              bucket,
              deleteSlug,
              context
            );
            setCatalogue(JSON.stringify(updatedCatalogue, null, 2));
          }}
        >
          Delete item from catalogue
        </Button>
        <JsonWrapper>
          <CodeEditor
            id="a_unique_id"
            value={catalogue}
            language="js"
            onChange={(e) => {
              // Reset messages on json edit
              if (successMsg) {
                setSuccessMsg("");
              }
              if (errorMsg) {
                setErrorMsg("");
              }
              setCatalogue(e.target.value);
            }}
            padding={0}
            style={{
              fontSize: ".8rem",
              backgroundColor: "#f5f5f5",
              fontFamily:
                "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            }}
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
  * {
    font-family: ui-monospace, SFMono-Regular, SF Mono, Consolas,
      Liberation Mono, Menlo, monospace;
  }
  border: 1px solid var(--secondary);
`;

const FormErrors = styled.span`
  color: red;
`;
const FormSuccess = styled.span`
  color: green;
`;
