import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';

import logo from '../assets/img/logo.png';
import api from '../utils/api';

export default function Editor() {
  const { id } = useParams();

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
      .get('upload/' + id, config)
      .then((res) => {
        setAudData(res.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Container fluid className="pt-4 px-5">
      <Row className="justify-content-center">
        <img src={logo} width="200" />
      </Row>

      <Row className="justify-content-center text-secondary mt-3 mb-5 h3">
        ~ Process Your Audio on Cloud ~
      </Row>
    </Container>
  );
}
