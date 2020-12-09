import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, ButtonGroup, Button } from 'react-bootstrap';
import { BsUpload } from 'react-icons/bs';
import { BiArrowBack } from 'react-icons/bi';
import { CgBrowse } from 'react-icons/cg';

import logo from '../assets/img/logo.png';

export default function Upload() {
  useEffect(() => {
    document.title = 'Upload | AudMIX';
  });

  const [fileName, setfileName] = useState('');

  const handelFileBrowse = () => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('accept', 'audio/*');
    fileSelector.click();
    fileSelector.addEventListener('change', function (event) {
      var filename = event.target.files[0].name;
      setfileName(filename);
    });
  };

  return (
    <Container fluid="xl" style={{ paddingTop: '20vh' }}>
      <Row className="justify-content-center">
        <img src={logo} width="200" />
      </Row>

      <Row className="justify-content-center text-secondary my-5 h2">Upload Audio or Video</Row>

      <Row className="justify-content-center text-primary mb-4 h5">{fileName}</Row>

      <Row className="justify-content-center">
        <ButtonGroup horizontal>
          <Button size="lg" variant="outline-primary" onClick={() => handelFileBrowse()}>
            <CgBrowse /> <br />
            Browse
          </Button>

          <Button size="lg" variant="outline-primary" disabled>
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
