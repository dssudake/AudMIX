import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Modal, ProgressBar, Spinner, Button } from 'react-bootstrap';

import logo from '../assets/img/logo.png';
import WaveAudioPlayer from '../components/WaveAudioPlayer';

const boxShadowStyle = {
  borderRadius: '10px',
  boxShadow: '11px 11px 17px #060606, -11px -11px 17px #161616',
  padding: '15px 15px 15px 15px',
};

// Modal to display audio denoising progress
export function ProgressModal({ modalHeader, show, percentage }) {
  return (
    <Modal show={show} backdrop="static" className="text-primary" size="lg" centered>
      <Modal.Header className="bg-dark text-secondary">
        <Modal.Title>
          <img src={logo} width="150px" className="mr-5" />
          <span className="ml-5 pl-5">{modalHeader}</span>
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
  modalHeader: PropTypes.string,
  show: PropTypes.bool.isRequired,
  percentage: PropTypes.number,
};

// Modal to display comparison between original and processed audio
export function CompareModal({ show, handleClose, audData }) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      className="text-primary"
      size="xl"
      centered
      scrollable
    >
      <Modal.Header className="bg-dark text-secondary">
        <Modal.Title className="mx-auto">Compare Audio : Original vs Processed</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 bg-dark">
        <Row>
          <Col xs={12}>
            {audData && <WaveAudioPlayer url={audData.audio} name={'Original Audio'} />}
          </Col>
          <Col xs={12} className="mt-5">
            {audData && <WaveAudioPlayer url={audData.processed_audio} name={'Processed Audio'} />}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="bg-dark">
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

CompareModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  audData: PropTypes.object,
};
