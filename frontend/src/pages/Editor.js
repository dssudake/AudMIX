import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';

import { Container, Row, Col, Button, Modal, ProgressBar, Spinner } from 'react-bootstrap';

import logo from '../assets/img/logo.png';
import api from '../utils/api';
import WaveAudioPlayer from '../components/WaveAudioPlayer';

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

  const [audData, setAudData] = useState(null);
  const fetchData = () => {
    api
      .get(`process_audio/${id}/`)
      .then((res) => {
        res.status === 200 && setAudData(res.data);
      })
      .catch((error) => console.log(error));
  };

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

  return (
    <Container fluid className="pt-4 pb-5 px-5 bg">
      <Row className="justify-content-center">
        <img src={logo} width="200" />
      </Row>

      <Row className="justify-content-center text-secondary mt-3 h3">
        ~ Process Your Audio on Cloud ~
      </Row>

      <Row className="justify-content-center" style={{ marginTop: '60px' }}>
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
                  {audData && <WaveAudioPlayer url={audData.audio} name={'Original Audio'} />}
                </Col>
                <Col xs={12} className="mt-5">
                  {audData && (
                    <WaveAudioPlayer url={audData.processed_audio} name={'Processed Audio'} />
                  )}
                </Col>
              </Row>
            </Col>

            <Col style={boxShadowStyle} md={4}>
              <Button variant="primary" disabled block>
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
              <Button variant="outline-secondary" className="mt-4" disabled block>
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
          </>
        )}
      </Row>
    </Container>
  );
}

function ProgressModal({ show, percentage }) {
  return (
    <Modal
      style={{
        borderRadius: '10px',
        boxShadow: '#060606',
      }}
      show={show}
      backdrop="static"
      className="text-primary"
      size="lg"
      centered
    >
      <Modal.Header className="bg-dark text-secondary">
        <Modal.Title>
          <img src={logo} width="150px" className="mr-5" />
          <span className="ml-5 pl-5">Denoise Audio</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 bg-dark">
        <Row style={boxShadowStyle}>
          <Col className="text-center h5 pt-3 mb-3" xs={12}>
            Please Wait While We Process The Audio !
          </Col>
          <Col className xs="auto">
            <Spinner animation="grow" variant="primary" />
          </Col>
          <Col>
            <ProgressBar className="mt-3" variant="custom" now={percentage} />
          </Col>
          <Col xs={12} className="text-center text-primary">
            {percentage < 100 ? `${percentage}% processed` : 'Complete .!'}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
ProgressModal.propTypes = {
  show: PropTypes.bool.isRequired,
  percentage: PropTypes.number,
};
