import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';

import logo from '../assets/img/logo.png';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found | AudMIX';
  }, []);

  return (
    <Container fluid="xl" style={{ paddingTop: '20vh' }}>
      <Row className="justify-content-center">
        <img src={logo} width="250" />
      </Row>

      <Row className="justify-content-center text-secondary my-4" style={{ fontSize: '100px' }}>
        ☹️
      </Row>

      <Row className="justify-content-center text-secondary mt-4 h2">404 Not Found</Row>

      <Row className="justify-content-center text-secondary mt-4 h4">
        Sorry, Requested page not found
      </Row>

      <Row className="justify-content-center mt-5">
        <Link to="/" className="border-bottom border-secondary text-secondary">
          <BiArrowBack /> Back to Home
        </Link>
      </Row>
    </Container>
  );
}
