import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

import exifr from "exifr/dist/full.esm.mjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import DatePicker from "react-datepicker";
import CreatableSelect from "react-select/creatable";
import { io } from "socket.io-client";
import styled from "styled-components";

import Header from "../../shared/components/header";
import { isNumeric } from "../../shared/utils/strings";
import { addressToCords, cordsToAddress } from "../src/utils/geocode";
import { SERVER_URL, SOCKET_URL } from "../src/utils/misc";

const DEFAULT_BREAKPOINTS = process.env.IMAGE_BREAKPOINTS.split(", ").map(
  (breakpoint) => ({
    value: breakpoint.trim(),
    label: breakpoint.trim(),
  })
);
const DEFAULT_TAGS = process.env.IMAGE_TAGS.split(", ").map((tag) => ({
  value: tag.trim(),
  label: tag.trim(),
}));
const IMAGE_MODELS_MAP = {
  "ILCE-7M3": "Sony a7 III",
};

const socket = io(SOCKET_URL);

// eslint-disable-next-line no-useless-escape
const imageNameRegex = new RegExp(/^[\w\-]+$/);

// Wrap page to easily change key and reset state
export default function App() {
  const [resetKey, setResetKey] = useState(1);
  return <Uploader key={resetKey} setResetKey={setResetKey} />;
}

function Uploader({ setResetKey }) {
  const [image, setImage] = useState();
  // S3 opts
  const [bucket, setBucket] = useState(process.env.BUCKET_NAME);
  const [folder, setFolder] = useState("");
  const [updateCatalogue, setUpdateCatalogue] = useState(true);

  // Quality and resize
  const [breakpoints, setBreakpoints] = useState(DEFAULT_BREAKPOINTS);
  const [imageQuality, setImageQuality] = useState(process.env.IMAGE_QUALITY);
  // Metadata
  const [metadata, setMetadata] = useState({});
  // All non-metadata values are set seperately because they will be used for sorting on site
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [alt, setAlt] = useState("");
  const [model, setModel] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState([]);
  // Image location
  const [imageLocation, setImageLocation] = useState("");
  const [imageLocations, setImageLocations] = useState([]);
  const [imageLatitude, setImageLatitude] = useState("");
  const [imageLongitude, setImageLongitude] = useState("");
  // Message states
  const [socketConnected, setSocketConnected] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketConnected(true);
      setShowToast(true);
    });
    socket.on("disconnect", () => {
      setSocketConnected(false);
      setShowToast(true);
    });
    socket.on("upload-part", (upload) => {
      setUploads((prev) => [...prev, upload]);
      let uploadPercent = (1 / breakpoints.length + 1) * 100;
      if (updateCatalogue) {
        uploadPercent = (1 / (breakpoints.length + 2)) * 100;
      }
      setUploadProgress((prev) => prev + uploadPercent);
    });
    socket.on("upload-part-fail", (upload) => {
      setUploads((prev) => [...prev, upload]);
      setUploadProgress(0);
    });

    return () => {
      socket.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onImageUpload = useCallback(async (e) => {
    // Reset on image upload
    setSuccessMsg("");
    setUploading(false);
    if (!e.target.files.length) {
      return setImage(undefined);
    }
    const file = e.target.files[0];
    let exifData = await exifr.parse(file);
    if (!exifData) {
      alert("No Exif data found for image");
      exifData = {};
    }
    const originalName = file.name;
    exifData.OriginalFilename = originalName;

    // Set location data
    const gpsData = await exifr.gps(file);
    if (gpsData?.latitude && gpsData?.longitude) {
      setImageLatitude(gpsData.latitude);
      setImageLongitude(gpsData.longitude);
      const addressOpts = await cordsToAddress(
        gpsData.latitude,
        gpsData.longitude
      );
      setImageLocations(addressOpts);
    }

    // Set model
    const mappedModel = IMAGE_MODELS_MAP[exifData.Model];
    setModel(mappedModel || exifData.Model);
    setDate(exifData.CreateDate);
    setTitle(originalName.replace(/\.[^/.]+$/, ""));
    setMetadata(exifData);
    setImage(file);

    // Show image preview
    const imagePreview = document.getElementById("image-preview");
    imagePreview.src = URL.createObjectURL(file);
  }, []);

  const onSubmit = async () => {
    setErrors([]);
    const onSubmitErrors = [];
    if (!image) {
      onSubmitErrors.push("Missing image file");
    }
    // If adding to catalogue, validate everything needed for display
    if (updateCatalogue) {
      if (!date) {
        onSubmitErrors.push("Missing image date");
      }
      if (!imageLongitude || !imageLatitude || !imageLocation) {
        onSubmitErrors.push("Missing location data");
      }
      if (!tags.length) {
        onSubmitErrors.push("Missing image tags");
      }
      if (!model) {
        onSubmitErrors.push("Missing image model");
      }
      if (!title) {
        onSubmitErrors.push("Missing Image title");
      }
    }
    if (!breakpoints.length) {
      onSubmitErrors.push("Missing Image breakpoints");
    }
    if (!alt) {
      onSubmitErrors.push("Missing Image alt");
    }
    if (!slug) {
      onSubmitErrors.push("Missing Image slug");
    }
    if (!imageNameRegex.test(slug)) {
      onSubmitErrors.push("Invalid image slug");
    }
    if (!bucket) {
      onSubmitErrors.push("Missing S3 Bucket");
    }
    if (!imageQuality) {
      onSubmitErrors.push("Missing Image quality");
    } else if (imageQuality < 1 || imageQuality > 100) {
      onSubmitErrors.push("Image quality must be between 1 and 100");
    }
    setErrors(onSubmitErrors);
    if (onSubmitErrors.length) {
      return;
    }

    setUploading(true);
    setUploads([]);
    setUploadProgress(0);

    const imageData = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error(`Error reading image: ${e}`));
      reader.readAsBinaryString(image);
    });

    // Get image width and height
    const dimensions = await new Promise((resolve, reject) => {
      const imageDom = new Image();
      imageDom.onload = function () {
        resolve({
          width: this.width,
          height: this.height,
        });
      };
      imageDom.onerror = (error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        reject(new Error(`Error getting image width and height: ${error}`));
      };
      imageDom.src = URL.createObjectURL(image);
    });

    const reqBody = {
      imageData: btoa(imageData),
      dimensions,
      metadata,
      imageQuality,
      updateCatalogue,
      title,
      slug,
      folder,
      bucket,
      date,
      alt,
      model,
      tags: tags.map((x) => x.value),
      breakpoints: breakpoints.map((x) => x.value),
      location: {
        address: imageLocation?.value,
        latitude: imageLocation?.lat,
        longitude: imageLocation?.long,
      },
    };
    const rawRes = await fetch(`${SERVER_URL}/upload`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    const res = await rawRes.json();
    if (res.error) {
      setErrors([res.error]);
    } else if (res.success) {
      setErrors([]);
      setSuccessMsg([res.success]);
    }
  };

  const metaDataForms = useMemo(
    () =>
      Object.entries(metadata).map((metaEntry) => {
        return (
          <Form.Group key={metaEntry[0]} className="mb-2">
            <Form.Label>{metaEntry[0]}</Form.Label>
            <Form.Control
              value={metaEntry[1]}
              onChange={(e) => {
                const newMetadata = {
                  ...metadata,
                  [metaEntry[0]]: e.target.value,
                };
                setMetadata(newMetadata);
              }}
              type="text"
            />
          </Form.Group>
        );
      }),
    [metadata]
  );

  const uploadsRender = useMemo(() => {
    return uploads.map((upload) => (
      <li key={upload.msg}>
        {upload.msg}{" "}
        {upload.url && (
          <a href={upload.url} target="_blank" rel="noreferrer">
            {upload.url}
          </a>
        )}
      </li>
    ));
  }, [uploads]);

  const errorsRender = useMemo(() => {
    if (errors) {
      return errors.map((er) => <li key={er}>{er}</li>);
    }
    return null;
  }, [errors]);

  return (
    <PageWrapper>
      <Header
        title="Uploader"
        subtitle="Images to S3"
        navLinks={[{ url: "/edit-catalogue", name: "Catalogue Manager" }]}
      />
      <ToastContainer position="top-center" className="mt-3">
        <Toast
          autohide
          delay={3000}
          show={showToast}
          onClose={() => setShowToast(false)}
        >
          <Toast.Header>
            <strong className="me-auto">
              {socketConnected ? "Socket connected!" : "Socket disconnected"}
            </strong>
          </Toast.Header>
        </Toast>
      </ToastContainer>
      <Container>
        <FormWrapper>
          <Form.Group className="mb-3">
            <Form.Text className="text-muted mt-3">
              Defaults are set from .env
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              onChange={onImageUpload}
              type="file"
              multiple={false}
              accept="image/*"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image Title</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/[^\w-]+/g, "")
                );
              }}
              type="text"
            />
            <Form.Text className="text-muted">Display name of image</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
              }}
              type="text"
            />
            <Form.Text className="text-muted">
              Custom image-name tag of S3 object
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>S3 Bucket Name</Form.Label>
            <Form.Control
              type="text"
              value={bucket}
              onChange={(e) => setBucket(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Folder prefix</Form.Label>
            <Form.Control
              type="text"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
            />
            <Form.Text className="text-muted">e.g. writing</Form.Text>
          </Form.Group>

          <Accordion className="mb-5">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Location</Accordion.Header>
              <Accordion.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Image Location</Form.Label>
                  <CreatableSelect
                    id="location-select"
                    instanceId="location-select"
                    options={imageLocations}
                    name="image-locations"
                    value={imageLocation}
                    onChange={async (option) => {
                      if (option.__isNew__) {
                        const cords = await addressToCords(option.value);
                        setImageLatitude(cords.lat);
                        setImageLongitude(cords.long);
                        option.lat = cords.lat;
                        option.long = cords.long;
                        setImageLocations((prev) => [...prev, option]);
                      } else {
                        setImageLatitude(option.lat);
                        setImageLongitude(option.long);
                      }
                      setImageLocation(option);
                    }}
                  />
                  <Form.Text className="text-muted">
                    If not automatically set, was not part of EXIF photo data
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    value={imageLongitude}
                    onChange={(e) => {
                      setImageLongitude(e.target.value);
                    }}
                    type="number"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    value={imageLatitude}
                    onChange={(e) => {
                      setImageLatitude(e.target.value);
                    }}
                    type="number"
                  />

                  <Button
                    className="mt-3"
                    variant="secondary"
                    onClick={async () => {
                      const options = await cordsToAddress(
                        imageLatitude,
                        imageLongitude
                      );
                      setImageLocations(options);
                      setImageLocation(options[0]);
                    }}
                  >
                    Update Location Opts from Cords
                  </Button>

                  <br />

                  {imageLongitude && imageLatitude && (
                    <Form.Text className="text-muted mt-3">
                      <a
                        href={`http://maps.google.com/maps?z=12&t=m&q=loc:${imageLatitude}+${imageLongitude}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Test location in GMaps
                      </a>
                    </Form.Text>
                  )}
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Image Display Data</Accordion.Header>
              <Accordion.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Capture Date</Form.Label>
                  <DatePicker
                    selected={date}
                    onChange={(_date) => setDate(_date)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <CreatableSelect
                    id="tags-select"
                    instanceId="tags-select"
                    options={DEFAULT_TAGS}
                    isMulti
                    name="tags"
                    value={tags}
                    onChange={(args) => {
                      setTags(args);
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Alt Text</Form.Label>
                  <Form.Control
                    value={alt}
                    onChange={(e) => {
                      setAlt(e.target.value);
                    }}
                    type="text"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Capture Model</Form.Label>
                  <Form.Control
                    value={model}
                    onChange={(e) => {
                      setModel(e.target.value);
                    }}
                    type="text"
                  />
                  <Form.Text className="text-muted">e.g. Sony a7 III</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3"></Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Metadata</Accordion.Header>
              <Accordion.Body>{metaDataForms}</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Quality and resize</Accordion.Header>
              <Accordion.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Quality</Form.Label>
                  <Form.Control
                    type="number"
                    value={imageQuality}
                    onChange={(e) => {
                      setImageQuality(e.target.value);
                    }}
                    min="1"
                    max="100"
                  />
                  <Form.Text className="text-muted">1-100%</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Breakpoints</Form.Label>
                  <CreatableSelect
                    id="breakpoints-select"
                    instanceId="breakpoints-select"
                    defaultValue={DEFAULT_BREAKPOINTS}
                    options={DEFAULT_BREAKPOINTS}
                    isMulti
                    name="breakpoints"
                    value={breakpoints}
                    onChange={(args) => {
                      for (const arg of args) {
                        // No non-numeric
                        if (!isNumeric(arg.value)) {
                          return;
                        }
                      }
                      setBreakpoints(args);
                    }}
                  />
                  <Form.Text className="text-muted">
                    {
                      "Images will resized and saved as {name}_{breakpoint}.{ext} "
                    }
                    for each breakpoint (In Pixels)
                  </Form.Text>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Update catalogue.json if present in folder"
              checked={updateCatalogue}
              onChange={(e) => {
                setUpdateCatalogue(e.target.checked);
              }}
            />
          </Form.Group>

          <Button variant="primary" onClick={onSubmit}>
            Begin Upload
          </Button>

          <Form.Group className="mt-3">
            <FormErrors>{errorsRender}</FormErrors>
          </Form.Group>
          <Form.Group className="mt-3">
            <FormSuccess>{successMsg}</FormSuccess>
            {successMsg && (
              <>
                <br />
                <Button className="mt-3" onClick={() => setResetKey(slug)}>
                  Reset Form
                </Button>
              </>
            )}
          </Form.Group>
          {uploading && (
            <Container className="mt-3">
              <h2 className="mb-3">Upload Progress</h2>
              <ProgressBar now={uploadProgress} />
              <Uploads>{uploadsRender}</Uploads>
            </Container>
          )}
        </FormWrapper>
      </Container>
      <Container>
        <FormWrapper>
          <h3>Image Preview</h3>
          <div className="image-area mt-4">
            <img
              id="image-preview"
              src="#"
              alt=""
              className="img-fluid rounded shadow-sm mx-auto d-block"
            />
          </div>
        </FormWrapper>
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

const FormWrapper = styled.div`
  padding: 25px;
  border: 1px solid grey;
  border-radius: 25px;
`;

const FormErrors = styled.ul`
  color: red;
`;
const FormSuccess = styled.span`
  color: green;
`;

const Uploads = styled.ul`
  margin: 1em 0;
`;
