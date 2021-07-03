import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ReactMic } from 'react-mic';

import { Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import { BsUpload, BsFillStopFill } from 'react-icons/bs';
import { CgRecord } from 'react-icons/cg';
import { AiOutlineClose } from 'react-icons/ai';

import ReactAudioPlayer from './ReactAudioPlayer';

const boxShadowStyle = {
  borderRadius: '5px',
  boxShadow: '11px 11px 17px #060606, -11px -11px 17px #161616',
  padding: '15px',
};

export default class AudioRecorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      isStop: false,
      src: '',
    };
  }

  startRecording = () => {
    this.setState({ record: true });
  };

  stopRecording = () => {
    this.setState({ record: false });
  };

  onSave = async (blobObject) => {
    let file = await new File([blobObject.blob], 'record.webm');
    this.props.setfile(file);
    this.setState({ isStop: true, src: blobObject.blobURL });
  };

  handleReset = () => {
    this.setState({
      record: false,
      isStop: false,
      src: '',
    });
    this.props.setfile(null);
  };

  render() {
    return (
      <>
        <Row className="justify-content-center text-center text-primary mb-4 h5">
          {!this.state.isStop ? (
            <Col style={boxShadowStyle} className="border border-primary mb-4" xs="auto">
              <ReactMic
                record={this.state.record}
                onSave={this.onSave}
                width={200}
                height={100}
                sampleRate={16000}
                strokeColor="#95bf9b"
                backgroundColor="#0e0e0e"
              />
            </Col>
          ) : (
            <Col className="border border-primary mb-4 rounded" xs={5}>
              <Row>
                <Col className="pt-3 pb-2 pr-4">
                  <ReactAudioPlayer src={this.state.src} handleReset={this.handleReset} />
                </Col>
                <Col
                  xs="auto"
                  className="border-left border-primary btn-outline-primary"
                  style={{ paddingTop: '43px' }}
                  onClick={this.handleReset}
                >
                  <AiOutlineClose />
                </Col>
              </Row>
            </Col>
          )}
        </Row>

        <Row className="justify-content-center">
          <ButtonGroup horizontal="true">
            <Button
              size="lg"
              disabled={this.state.record || this.state.isStop}
              variant="outline-primary"
              onClick={this.startRecording}
            >
              <CgRecord /> <br />
              Record
            </Button>
            <Button
              size="lg"
              disabled={!this.state.record || this.state.isStop}
              variant="outline-primary"
              onClick={this.stopRecording}
            >
              <BsFillStopFill /> <br /> Stop
            </Button>
            <Button
              size="lg"
              disabled={!this.state.isStop}
              variant="outline-secondary"
              onClick={this.props.handelUpload}
            >
              <BsUpload /> <br /> Upload
            </Button>
          </ButtonGroup>
        </Row>
      </>
    );
  }
}

AudioRecorder.propTypes = {
  handelUpload: PropTypes.func,
  setfile: PropTypes.func,
};
