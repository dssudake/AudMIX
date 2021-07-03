import React, { useState } from 'react';
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
  const [url1, setUrl1] = useState(audData.audio);
  const [name1, setName1] = useState('Original Audio');
  const handleSetData1 = (url, name) => {
    setUrl1(url);
    setName1(name);
  };
  const [url2, setUrl2] = useState(audData.audio);
  const [name2, setName2] = useState('Original Audio');
  const handleSetData2 = (url, name) => {
    setUrl2(url);
    setName2(name);
  };
  // console.log(show);
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
        <img src={logo} width="150px" className="mr-5" />
        <Modal.Title className="mx-auto">Compare Audio : Original vs Processed</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 bg-dark">
        <Row>
          <Col xs={12}>
            {audData && (
              <WaveAudioPlayer
                url={url1}
                name={name1}
                handelSetData={handleSetData1}
                audData={audData}
                up={false}
              />
            )}
          </Col>
          <Col xs={12} className="mt-5">
            {audData && (
              <WaveAudioPlayer
                url={url2}
                name={name2}
                handelSetData={handleSetData2}
                audData={audData}
                up={true}
              />
            )}
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
  handelSetData: PropTypes.func,
};
