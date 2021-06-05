import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Container, Row, Table, Button } from 'react-bootstrap';

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
        Note : click on launch to open the audio in editor
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
          <Table borderless size="md" className="text-primary">
            <thead className="text-secondary">
              <tr>
                <th width="5%">#</th>
                <th width="40%">Name</th>
                <th width="20%">Created At</th>
                <th width="20%">Updated At</th>
                <th width="15%" className="text-center">
                  Open In Editor
                </th>
              </tr>
            </thead>
            <tbody>
              {audData.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{moment(item.created_at).format('YYYY-MM-DD LTS')}</td>
                  <td>{moment(item.modified_at).format('YYYY-MM-DD LTS')}</td>
                  <td className="text-center">
                    <Link to={'/editor/' + item.id}>
                      <Button variant="secondary" size="sm">
                        Launch
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Row>
    </Container>
  );
}
