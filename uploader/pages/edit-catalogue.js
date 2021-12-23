import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import styled from "styled-components";

import Header from "../../shared/components/header";
import { SERVER_URL } from "../src/utils/misc";

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
  setCatalogue(res);
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
    body: JSON.stringify(catalogue),
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
  const [catalogue, setCatalogue] = useState({});
  const [bucket, setBucket] = useState(process.env.BUCKET_NAME);
  const [deleteSlug, setDeleteSlug] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const context = {
    setSuccessMsg,
    setErrorMsg,
    setShowToast,
  };

  useEffect(() => {
    getCatalogue(bucket, setCatalogue, context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper>
      <ToastContainer position="top-center" className="mt-3">
        <Toast
          autohide
          delay={3000}
          show={showToast}
          onClose={() => setShowToast(false)}
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
          navLinks={[
            { url: "/edit-catalogue", name: "Catalogue Manager", active: true },
          ]}
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
            setCatalogue(syncedCatalogue);
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
            setCatalogue(updatedCatalogue);
          }}
        >
          Delete item from catalogue
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
