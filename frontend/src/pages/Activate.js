import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Container, Row } from 'react-bootstrap';

import api from '../utils/api';
import NavBar from '../components/NavBar';

export default function Activate() {
  const params = useParams();

  useEffect(() => {
    document.title = 'Activate Account | AudMIX';
    handelVerify();
  }, []);

  const [isVerified, setIsVerified] = useState(true);
  const [actErr, setActErr] = useState('');

  const handelVerify = () => {
    const uid = params.uid;
    const token = params.token;

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ uid, token });

    api
      .post('auth/users/activation/', body, config)
      .then((res) => {
        res.status === 204 && setIsVerified(true);
      })
      .catch((err) => {
        err.response.status === 400 && setActErr('Invalid Activation Link :( ');
        setIsVerified(false);
      });
  };

  return (
    <Container fluid="xl">
      <NavBar />

      <Row
        className="justify-content-center text-center text-secondary h2"
        style={{ marginTop: '20vh' }}
      >
        {isVerified ? (
          <span>
            Your Account has been Verfied :) <br />
            <Link to="/login">Login Now!</Link>
          </span>
        ) : actErr ? (
          <span>
            <Row>{actErr}</Row>
            <Row
              className="justify-content-center text-secondary mt-4"
              style={{ fontSize: '100px' }}
            >
              ☹️
            </Row>
          </span>
        ) : (
          <span>
            Stale Activation Link :(
            <br />
            Try to <Link to="/login">Login</Link> With Registered credentials!
          </span>
        )}
      </Row>
    </Container>
  );
}
