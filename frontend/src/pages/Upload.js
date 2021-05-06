import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Container, Row, ButtonGroup, Button } from 'react-bootstrap';
import { BsUpload } from 'react-icons/bs';
import { BiArrowBack } from 'react-icons/bi';
import { CgBrowse } from 'react-icons/cg';
import { AiOutlineClose } from 'react-icons/ai';

import logo from '../assets/img/logo.png';
import api from '../utils/api';

export default function Upload() {
  useEffect(() => {
    document.title = 'Upload | AudMIX';
  });

  const history = useHistory();
  const [isUploaded, setIsUploaded] = useState(false);
  const [counter, setCounter] = React.useState(0);
  const [id, setId] = useState('');
  useEffect(() => {
    if (isUploaded) {
      counter > 0 ? setTimeout(() => setCounter(counter - 1), 1000) : history.push('/editor/' + id);
    }
  }, [counter]);

  const [isFileSelected, setFileSelected] = useState(false);
  const [File, setfile] = useState(null);

  const namer = (name) => {
    var d = new Date();
    var ext =
      name + '_' + d.toLocaleDateString().replaceAll('/', '-') + '_' + d.toLocaleTimeString();
    return ext;
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleFileBrowse = () => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('accept', 'audio/*,video/*');
    fileSelector.click();
    fileSelector.addEventListener('change', function (event) {
      var file = event.target.files[0];
      setfile(file);
      setFileSelected(true);
    });
  };

  const handelUpload = () => {
    var fileName = namer(File.name);
    const uploadData = new FormData();
    uploadData.append('name', fileName);
    uploadData.append('audio', File);
    api
      .post('upload/', uploadData, {})
      .then((res) => {
        if (res.status === 201) {
          setIsUploaded(true);
          setCounter(6);
          setId(res.data.id);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Container fluid="xl" style={{ paddingTop: '20vh' }}>
      <Row className="justify-content-center">
        <img src={logo} width="200" />
      </Row>

      <Row className="justify-content-center text-secondary my-5 h2">Upload Audio or Video</Row>
      {isUploaded ? (
        <Row className="justify-content-center text-center text-primary mb-4 h5">
          File successfully uploaded.
          <br />
          <br />
          Redirecting you in {counter === 0 ? '0' : counter} sec...
        </Row>
      ) : (
        <>
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
        </>
      )}
    </Container>
  );
}
