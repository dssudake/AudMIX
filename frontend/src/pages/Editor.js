import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { Container, Row, Col, Button } from 'react-bootstrap';

import logo from '../assets/img/logo.png';
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
      })
      .catch((error) => console.log(error));
  };

  // Audio Denoising API call and display updated progress
  const [redNoiseModal, setredNoiseModal] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const handleAudioDenoise = () => {
    api
      .put(`process_audio/${id}/reduce_noise/`)
      .then((res) => {
        if (res.status === 201) {
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
      link.href = audData.processed_audio;
      link.target = '_blank';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Container fluid className="pt-4 pb-5 px-5 bg">
      <Row className="justify-content-center">
        <img src={logo} width="200" />
      </Row>

      <Row className="justify-content-center text-secondary mt-3 h3">
        ~ Process Your Audio on Cloud ~
      </Row>

      <Row className="justify-content-center" style={{ marginTop: '100px' }}>
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
                <Col xs={12}>
                  {audData && (
                    <WaveAudioPlayerFL url={audData.processed_audio} name={'Processed Audio'} />
                  )}
                </Col>
              </Row>
            </Col>

            <Col style={boxShadowStyle} md={4}>
              <Button variant="primary" onClick={handleShow} block>
                Compare Original {'&'} Processed Audio
              </Button>
              <hr className="divider mt-4" />
              <Button
                variant="outline-secondary"
                onClick={handleAudioDenoise}
                className="mt-4"
                block
              >
                Denoise Audio
              </Button>
              <hr className="divider mt-4" />
              <Button
                variant="outline-secondary"
                onClick={handeAudioDownload}
                className="mt-4"
                block
              >
                Download Processed Audio
              </Button>
              <Button variant="outline-secondary" className="mt-4" disabled block>
                Download Spectrogram
              </Button>
              <Button variant="outline-secondary" className="mt-4" disabled block>
                Download Audio Waveform
              </Button>
            </Col>

            <ProgressModal show={redNoiseModal} percentage={percentage} />

            <CompareModal show={showCompare} handleClose={handleClose} audData={audData} />
          </>
        )}
      </Row>
    </Container>
  );
}
