import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BsCloudUpload, BsCloudDownload } from 'react-icons/bs';
import { SiAudiomack } from 'react-icons/si';
import { FiFastForward } from 'react-icons/fi';

import logo from '../assets/img/logo.png';
import banner from '../assets/img/banner.png';

export default function Home() {
  useEffect(() => {
    document.title = 'Make Your Audio Sound Better | AudMIX';
  });

  return (
    <Container fluid="xl" className="pt-4">
      <Row className="pl-3">
        <img src={logo} width="200" />
      </Row>

      <img className="my-5 rounded" src={banner} width="100%" />

      <Row className="justify-content-center text-secondary mb-4 h2">
        Process Your Audio on Cloud with AudMIX !
      </Row>

      <Row className="justify-content-between my-5">
        <Col xs={12} className="h4 text-center text-primary">
          Easy 3 Step Process
        </Col>

        <Card className="text-center bg-dark border-0" style={{ width: '18rem' }}>
          <Card.Body>
            <BsCloudUpload className="text-primary h1" />
            <Card.Title className="text-success">Upload Audio / Video</Card.Title>
            <Card.Text className="text-primary">
              Upload Audio or Video to be Modified in the online <br />
              editor
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="text-center bg-dark border-0" style={{ width: '18rem' }}>
          <Card.Body>
            <SiAudiomack className="text-primary h1" />
            <Card.Title className="text-success">Modify Your Audio</Card.Title>
            <Card.Text className="text-primary">
              Edit your audio in the web editor window with the features available
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="text-center bg-dark border-0" style={{ width: '18rem' }}>
          <Card.Body>
            <BsCloudDownload className="text-primary h1" />
            <Card.Title className="text-success">Get Modified Audio</Card.Title>
            <Card.Text className="text-primary">
              Download modified audio or video content or share with others
            </Card.Text>
          </Card.Body>
        </Card>
      </Row>

      <Row className="justify-content-center">
        <Button size="lg" variant="outline-primary">
          Get Started <FiFastForward />
        </Button>
      </Row>
    </Container>
  );
}
