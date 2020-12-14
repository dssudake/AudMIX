import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, ButtonGroup, Button } from 'react-bootstrap';
import { BsUpload } from 'react-icons/bs';
import { BiArrowBack } from 'react-icons/bi';
import { CgBrowse } from 'react-icons/cg';
import axios from 'axios';
import logo from '../assets/img/logo.png';

export default function Upload() {
  useEffect(() => {
    document.title = 'Upload | AudMIX';
  });
  const [fileName, setfileName] = useState('No file selected');
  const [File, setfile] = useState();
  function namer(name) {
    var len = name.length;
    var d = new Date();
    var ext = name.slice(0, len - 4) + '_' + d.getTime();
    return ext;
  }
  function handleFileBrowse() {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('accept', 'audio/*');
    fileSelector.click();
    fileSelector.addEventListener('change', function (event) {
      document.getElementById('upload_button').disabled = false;
      var File = event.target.files[0];
      var filename = namer(File.name);
      setfileName(filename);
      setfile(File);
    });
  }
  const upload = () => {
    console.log(File.name);
    console.log(fileName);
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
      <Row className="justify-content-center text-primary mb-4 h5">{fileName}</Row>
      <Row className="justify-content-center">
        <ButtonGroup horizontal="true">
          <Button
            size="lg"
            id="browse_button"
            variant="outline-primary"
            onClick={() => handleFileBrowse()}
          >
            <CgBrowse /> <br />
            Browse
          </Button>
          <Button
            type={Button}
            disabled={false}
            size="lg"
            variant="outline-primary"
            onClick={() => upload()}
            id="upload_button"
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
