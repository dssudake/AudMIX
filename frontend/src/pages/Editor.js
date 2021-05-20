import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';

import { Container, Row, Col, Button, Modal, ProgressBar, Spinner } from 'react-bootstrap';

import logo from '../assets/img/logo.png';
import api from '../utils/api';
import WaveAudioPlayer from '../components/WaveAudioPlayer';

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
          setTimeout(setredNoiseModal(false), 1000);
          fetchData();
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Container fluid className="pt-4 pb-5 px-5">
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

            <Col
              style={{
                borderRadius: '10px',
                boxShadow: '11px 11px 17px #060606, -11px -11px 17px #161616',
                padding: '15px 15px 15px 15px',
              }}
              md={4}
            >
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
    <Modal show={show} backdrop="static" size="xl" centered scrollable>
      <Modal.Header className="bg-dark text-primary">
        <Modal.Title className="mx-auto">Please wait till we process the audio</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 bg-dark">
        <Row>
          <Col xs="auto">
            <Spinner animation="grow" variant="success" />
          </Col>
          <Col>
            <ProgressBar
              className="mt-2"
              variant="success"
              now={percentage}
              label={`${percentage}%`}
              animated
            />
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
