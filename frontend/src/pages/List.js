import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Container, Row } from 'react-bootstrap';

import api from '../utils/api';
import NavBar from '../components/NavBar';

export default function List() {
  useEffect(() => {
    document.title = 'List of uploaded media files | AudMIX';
    fetchData();
  }, []);

  const [audData, setAudData] = useState([]);
  const fetchData = () => {
    api
      .get('upload/')
      .then((res) => {
        setAudData(res.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Container fluid="xl">
      <NavBar />

      <Row className="justify-content-center text-secondary mt-5 mb-4 h2">
        Media files Uploaded for Processing
      </Row>

      <Row className="justify-content-center text-secondary mb-5">
        Note : click on link to open the audio in editor
      </Row>

      <Row className="justify-content-center text-primary">
        {audData.length === 0 ? (
          <>
            <span>No uploaded files are available,&nbsp;</span>
            <Link to="/upload/">
              <u>upload now</u>
            </Link>
          </>
        ) : (
          <ol>
            {audData.map((item) => (
              <li key={item.id}>
                <Link to={'/editor/' + item.id}>{item.name}</Link>
              </li>
            ))}
          </ol>
        )}
      </Row>
    </Container>
  );
}
