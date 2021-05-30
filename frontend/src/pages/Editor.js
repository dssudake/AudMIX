import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

import { Container, Row, Col, ButtonGroup, Button } from 'react-bootstrap';

import NavBar from '../components/NavBar';
import api from '../utils/api';
import WaveAudioPlayerFL from '../components/WaveAudioPlayerFL';
import { ProgressModal, CompareModal } from '../components/EditorModals';

const boxShadowStyle = {
  borderRadius: '10px',
  boxShadow: '11px 11px 17px #060606, -11px -11px 17px #161616',
  padding: '15px 15px 15px 15px',
};

export default function Editor() {
  const { id } = useParams();
  const audPlayerRef = useRef(null);

  useEffect(() => {
    document.title = 'Editor  | AudMIX - Process Your Audio on Cloud';
    fetchData();
  }, []);

  // Fetch Audio Details for given id in Url
  const [audData, setAudData] = useState(null);
  const fetchData = () => {
    api
      .get(`process_audio/${id}/`)
      .then((res) => {
        res.status === 200 && setAudData(res.data);
        setUrl(res.data.audio);
        setName('Original Audio');
      })
      .catch((error) => console.log(error));
  };

  // Waveaudioplayer parameters
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');

  const handelSetData = (url, name) => {
    setUrl(url);
    setName(name);
  };

  // Audio Denoising API call and display updated progress
  const [redNoiseModal, setredNoiseModal] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [modalHeader, setModalHeader] = useState('');
  const handleAudioDenoise = () => {
    api
      .put(`process_audio/${id}/reduce_noise/`)
      .then((res) => {
        if (res.status === 201) {
          setModalHeader('Denoise Audio');
          setredNoiseModal(true);
          checkProcessStatus(res.data.task_id);
        }
      })
      .catch((error) => console.log(error));
  };

  // Audio Separate API call and display updated progress
  const handleAudioSeparate = () => {
    api
      .put(`process_audio/${id}/separate_audio/`)
      .then((res) => {
        if (res.status === 201) {
          setModalHeader('Separate Vocals & Music');
          setredNoiseModal(true);
          checkProcessStatus(res.data.task_id);
        }
      })
      .catch((error) => console.log(error));
  };

  const checkProcessStatus = (task_id) => {
    api
      .get(`task_status/${task_id}/`)
      .then((res) => {
        if (!res.data.complete) {
          setPercentage(res.data.progress.percent);
          setTimeout(checkProcessStatus(task_id), 1000);
        } else {
          setPercentage(100);
          setTimeout(function () {
            setredNoiseModal(false);
            fetchData();
          }, 2000);
        }
      })
      .catch((error) => console.log(error));
  };

  // Comparison Modal state handeling
  const [showCompare, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Function to Downlaod processed audio
  const handeAudioDownload = () => {
    if (audData) {
      var link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Container fluid className="pb-5 px-5 bg">
      <NavBar />

      <Row className="justify-content-center text-secondary mt-3 h3">
        ~ Process Your Audio on Cloud ~
      </Row>

      <Row className="justify-content-center" style={{ marginTop: '80px' }}>
        {!audData ? (
          <div className="text-primary">
            Audio file not available, check available&nbsp;
            <Link to="/list">
              <u>list</u>
            </Link>
            {' or '}
            <Link to="/upload">
              <u>upload now</u>
            </Link>
          </div>
        ) : (
          <>
            <Col className="pr-5">
              <Row>
                {url && (
                  <Col xs={12}>
                    {audData && (
                      <WaveAudioPlayerFL
                        ref={audPlayerRef}
                        audData={audData}
                        url={url}
                        name={name}
                        handelSetData={handelSetData}
                      />
                    )}
                  </Col>
                )}
              </Row>
            </Col>

            <Col style={boxShadowStyle} md={4}>
              <Button variant="outline-secondary" onClick={handleShow} block>
                Compare Original {'&'} Processed Audio
              </Button>
              <hr className="divider mt-4" />
              <ButtonGroup className="w-100">
                <Button
                  variant="outline-primary"
                  onClick={handleAudioDenoise}
                  disabled={audData.denoised_audio !== null}
                  className="mt-4"
                >
                  Denoise Audio
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={handleAudioSeparate}
                  disabled={audData.vocals_audio !== null}
                  className="mt-4"
                >
                  Separate Audio
                </Button>
              </ButtonGroup>
              <hr className="divider mt-4" />
              <Button
                variant="outline-secondary"
                onClick={handeAudioDownload}
                className="mt-4"
                block
              >
                Download Processed Audio
              </Button>
              <Button
                variant="outline-secondary"
                className="mt-4"
                onClick={() => audPlayerRef.current.handelWaveformExport()}
                block
              >
                Download Audio Waveform
              </Button>
              <Button variant="outline-secondary" className="mt-4" disabled block>
                Download Spectrogram
              </Button>
            </Col>

            <ProgressModal modalHeader={modalHeader} show={redNoiseModal} percentage={percentage} />

            <CompareModal
              show={showCompare}
              handleClose={handleClose}
              audData={audData}
              handelSetData={handelSetData}
            />
          </>
        )}
      </Row>
    </Container>
  );
}
