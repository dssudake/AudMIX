import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, ButtonGroup, Button } from 'react-bootstrap';
import { BsUpload } from 'react-icons/bs';
import { BiArrowBack } from 'react-icons/bi';
import { CgBrowse } from 'react-icons/cg';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';

import logo from '../assets/img/logo.png';

export default function Upload() {
  useEffect(() => {
    document.title = 'Upload | AudMIX';
  });

  const [isFileSelected, setFileSelected] = useState(false);
  const [File, setfile] = useState(null);

  function namer(name) {
    var len = name.length;
    var d = new Date();
    var ext = name.slice(0, len - 4) + '_' + d.getTime();
    return ext;
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  function handleFileBrowse() {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('accept', 'audio/*');
    fileSelector.click();
    fileSelector.addEventListener('change', function (event) {
      var file = event.target.files[0];
      setfile(file);
      setFileSelected(true);
    });
  }

  const handelUpload = () => {
    var fileName = namer(File.name);
    const uploadData = new FormData();
    uploadData.append('Name', fileName);
    uploadData.append('File', File, File.name);
    axios
      .post('http://127.0.0.1:8000/api/upload/', uploadData, {})
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
    alert('File Uploaded');
  };

  return (
    <Container fluid="xl" style={{ paddingTop: '20vh' }}>
      <Row className="justify-content-center">
        <img src={logo} width="200" />
      </Row>

      <Row className="justify-content-center text-secondary my-5 h2">Upload Audio or Video</Row>

      <Row className="justify-content-center text-primary mb-4 h5">
        <ButtonGroup>
          <Button variant="outline-secondary" className="bg-dark text-secondary px-5">
            {!isFileSelected ? (
              <>Browse & Select File to Upload</>
            ) : (
              <>
                {File.name}
                <br />
                {formatBytes(File.size)}
              </>
            )}
          </Button>
          {isFileSelected && (
            <Button
              variant="outline-secondary"
              onClick={() => {
                setfile(null);
                setFileSelected(false);
              }}
            >
              <AiOutlineClose />
            </Button>
          )}
        </ButtonGroup>
      </Row>

      <Row className="justify-content-center">
        <ButtonGroup horizontal="true">
          <Button
            size="lg"
            disabled={isFileSelected}
            variant="outline-primary"
            onClick={() => handleFileBrowse()}
          >
            <CgBrowse /> <br />
            Browse
          </Button>
          <Button
            size="lg"
            disabled={!isFileSelected}
            variant="outline-secondary"
            onClick={() => handelUpload()}
          >
            <BsUpload /> <br /> Upload
          </Button>
        </ButtonGroup>
      </Row>

      <Row className="justify-content-center mt-5">
        <Link to="/" className="border-bottom border-secondary text-secondary">
          <BiArrowBack /> Back to Home
        </Link>
      </Row>
    </Container>
  );
}
