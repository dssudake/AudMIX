import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import logo from '../assets/img/logo.png';
import api from '../utils/api';
import WaveAudioPlayer from '../components/WaveAudioPlayer';

export default function Editor() {
  const { id } = useParams();
  const [audData, setAudData] = useState(null);

  useEffect(() => {
    document.title = 'Editor  | AudMIX - Process Your Audio on Cloud';
    fetchData();
  }, []);

  const fetchData = () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    api
      .get('process_audio/' + id, config)
      .then((res) => {
        res.status === 200 && setAudData(res.data);
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
                  {audData && <WaveAudioPlayer url={audData.audio} name={'Processed Audio'} />}
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
            ></Col>
          </>
        )}
      </Row>
    </Container>
  );
}
