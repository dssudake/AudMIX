import React, { useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import NavBar from '../components/NavBar';
import InputField from '../components/InputField';

const schema = yup.object().shape({
  username: yup.string().required('Username Required'),
  password: yup.string().required('Password Required'),
});

export default function Login() {
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = 'Login | AudMIX';
  }, []);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => console.log(data);

  if (auth.isAuthenticated) return <Redirect to="/" />;

  return (
    <Container fluid="xl">
      <NavBar />

      <Row className="justify-content-center text-secondary mt-5" style={{ paddingTop: '8vh' }}>
        <Col xs={12} sm={8} md={6} lg={5} className="border border-secondary rounded">
          <Row className="pt-3 pb-5 px-1">
            <Col sm={12} className="text-center mt-3 mb-4 h5">
              Login | Sign In
            </Col>

            <Col sm={12}>
              <Form>
                <InputField
                  label="User Name"
                  type="text"
                  name="username"
                  register={register}
                  errors={errors.username?.message}
                />

                <InputField
                  label="Password"
                  type="password"
                  name="password"
                  register={register}
                  errors={errors.password?.message}
                />

                <Form.Text className="text-right mb-3">
                  <Link to="/reset_password">Forgot Password?</Link>
                </Form.Text>

                <Button variant="primary" onClick={handleSubmit(onSubmit)} block>
                  Login
                </Button>
              </Form>
            </Col>
          </Row>
        </Col>

        <Col xs={12} />

        <Col
          xs={12}
          sm={8}
          md={6}
          lg={5}
          className="border border-secondary rounded mt-5 py-4 text-center"
        >
          New User? <Link to="/signup">Create an account.</Link>
        </Col>
      </Row>
    </Container>
  );
}
