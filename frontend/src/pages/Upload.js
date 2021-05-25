import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { Container, Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';
import { GiSoundWaves } from 'react-icons/gi';
import { BsMusicNoteList } from 'react-icons/bs';
import { RiMicFill } from 'react-icons/ri';

import NavBar from '../components/NavBar';
import UploadFile from '../components/UploadFile';
import AudioRecorder from '../components/AudioRecorder';
import api from '../utils/api';

export default function Upload() {
  const history = useHistory();

  useEffect(() => {
    document.title = 'Upload | AudMIX';
  }, []);

  const [isUploaded, setIsUploaded] = useState(false);
  const [counter, setCounter] = React.useState(0);
  const [id, setId] = useState('');
  useEffect(() => {
    if (isUploaded) {
      counter > 0 ? setTimeout(() => setCounter(counter - 1), 1000) : history.push('/editor/' + id);
    }
  }, [counter]);

  const [File, setfile] = useState(null);

  const namer = (name) => {
    var d = new Date();
    var ext =
      name + '_' + d.toLocaleDateString().replaceAll('/', '-') + '_' + d.toLocaleTimeString();
    return ext;
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

  const [isRecord, setIsRecord] = useState(false);

  return (
    <Container fluid="xl">
      <NavBar />

      <Row className="justify-content-center text-secondary mt-5 h2" style={{ paddingTop: '8vh' }}>
        <Col className="text-center pb-2" style={{ fontSize: '70px' }}>
          <GiSoundWaves />
        </Col>
      </Row>

      <Row className="justify-content-center text-center mb-5">
        <ButtonGroup horizontal="true">
          <Button
            variant={isRecord ? 'outline-primary' : 'primary'}
            className={isRecord && 'bg-dark text-primary'}
            onClick={() => setIsRecord(false)}
          >
            <BsMusicNoteList /> <br />
            File Upload
          </Button>
          <Button
            variant={!isRecord ? 'outline-secondary' : 'secondary'}
            className={!isRecord && 'bg-dark text-secondary'}
            onClick={() => setIsRecord(true)}
          >
            <RiMicFill /> <br /> Record Audio
          </Button>
        </ButtonGroup>
      </Row>

      {isUploaded ? (
        <Row className="justify-content-center text-center text-primary mb-4 h5">
          File successfully uploaded.
          <br />
          <br />
          Redirecting you in {counter === 0 ? '0' : counter} sec...
        </Row>
      ) : isRecord ? (
        <AudioRecorder handelUpload={handelUpload} setfile={setfile} />
      ) : (
        <UploadFile handelUpload={handelUpload} setfile={setfile} File={File} />
      )}

      <Row className="justify-content-center mt-5">
        <Link to="/" className="border-bottom border-secondary text-secondary">
          <BiArrowBack /> Back to Home
        </Link>
      </Row>
    </Container>
  );
}
