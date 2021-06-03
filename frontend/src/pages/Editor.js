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
  const [audData, setAudData] = useState(null);
  const [reset, setReset] = useState(true);
  useEffect(() => {
    document.title = 'Editor  | AudMIX - Process Your Audio on Cloud';
    fetchData('initial');
  }, []);

  // Fetch Audio Details for given id in Url

  const fetchData = (source) => {
    setIsCrop(false);
    api
      .get(`process_audio/${id}/`)
      .then((res) => {
        res.status === 200 && setAudData(res.data);
        if (source === 'initial') {
          setUrl(res.data.audio);
          setName('Original Audio');
        } else if (source === 'refresh') {
          setUrl(res.data.audio);
          switch (name) {
            case 'Original Audio':
              setUrl(res.data.audio);
              break;
            case 'Denoised Audio':
              setUrl(res.data.denoised_audio);
              break;
            case 'Vocals Only':
              setUrl(res.data.vocals_audio);
              break;
            case 'Music only':
              setUrl(res.data.music_audio);
              break;
          }
        }
      })
      .catch((error) => console.log(error));
  };

  // Waveaudioplayer parameters
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');

  const handelSetData = (url, name) => {
    setUrl(url);
    setName(name);
    setIsCrop(false);
  };

  // Audio Denoising API call and display updated progress
  const [redNoiseModal, setredNoiseModal] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [modalHeader, setModalHeader] = useState('');
  const [isCrop, setIsCrop] = useState(false);
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

  // Crop Audio API call and display updated progress
  const handelCropMerge = () => {
    const data = audPlayerRef.current.handelGetSegements();
    console.log(data);
    const uploadData = new FormData();
    uploadData.append('name', name);
    uploadData.append('Segments', data);
    api
      .put(`process_audio/${id}/crop_audio/`, uploadData, {})
      .then((res) => {
        if (res.status === 201) {
          setModalHeader('Crop & Merge');
          setredNoiseModal(true);
          checkProcessStatus(res.data.task_id);
        }
      })
      .catch((error) => console.log(error));
  };
  const handleReset = () => {
    const uploadData = new FormData();
    uploadData.append('name', name);
    api
      .put(`process_audio/${id}/reset_waveform/`, uploadData, {})
      .then((res) => {
        if (res.status === 201) {
          fetchData('refresh');
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
            fetchData('refresh');
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
                        isCrop={isCrop}
                        handelSetData={handelSetData}
                        reset={setReset}
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
                  variant={audData.denoised_audio ? 'primary' : 'outline-primary'}
                  onClick={handleAudioDenoise}
                  disabled={audData.denoised_audio !== null}
                >
                  Denoise Audio
                </Button>
                <Button
                  variant={audData.vocals_audio ? 'secondary' : 'outline-secondary'}
                  onClick={handleAudioSeparate}
                  disabled={audData.vocals_audio !== null}
                >
                  Separate Audio
                </Button>
              </ButtonGroup>
              <ButtonGroup className="w-100 mt-4">
                <Button
                  variant={isCrop ? 'secondary' : 'outline-secondary'}
                  className={!isCrop && 'bg-dark text-secondary'}
                  onClick={() => {
                    isCrop
                      ? audPlayerRef.current.handelRemoveRegions()
                      : audPlayerRef.current.handelAddRegion();
                    setIsCrop(!isCrop);
                  }}
                >
                  Set Crop Intervals
                </Button>
                <Button variant="outline-primary" onClick={handelCropMerge} disabled={!isCrop}>
                  Crop {'&'} Merge Segment
                </Button>
              </ButtonGroup>
              <Button
                variant="outline-danger"
                className="w-100 mt-4"
                disabled={reset}
                onClick={handleReset}
              >
                Start Over
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
