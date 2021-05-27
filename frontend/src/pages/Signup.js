import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import api from '../utils/api';
import NavBar from '../components/NavBar';
import InputField from '../components/InputField';
import { USERNAME_REGEX } from '../utils/regexExp';

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is Required')
    .matches(USERNAME_REGEX, 'Please Enter Valid Username'),
  email: yup.string().required('Email Id is Required').email('Email must be a valid email'),
  password: yup.string().required('Password is Required'),
  confirm_password: yup
    .string()
    .required('Confirm Password is Required')
    .oneOf([yup.ref('password'), null], 'Password does not match'),
});

export default function Signup() {
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = 'Sign Up | AudMIX';
  }, []);

  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  const [isRegistered, setIsRegistered] = useState(false);
  const [regErrors, setRegErrors] = useState('');

  const signup = async (username, email, password) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ username, email, password });

    try {
      const res = await api.post('auth/users/', body, config);
      if (res.status === 200 || res.status === 201) {
        setIsRegistered(true);
        setRegErrors(
          'Successfully Signed Up! Activation link has been sent to your email account.'
        );
        reset();
      }
    } catch (err) {
      var res = err.response;
      var msg = '';
      if (res.status === 400 || res.status === 403 || res.status === 401) {
        if (res.data.username !== undefined) {
          if (
            res.data.username[0].search('already') !== -1 &&
            res.data.username[0].search('exists') !== -1
          ) {
            msg = 'Username Already Taken. Try with other.';
          }
        } else if (res.data.password !== undefined) {
          msg = 'Please Enter Strong Password with minimum 8 characters.';
        } else {
          msg = 'Enter Valid Credentials.';
        }
      } else {
        msg = 'Something went wrong! Registeration Failed';
      }
      setRegErrors(msg);
    }
  };

  const onSubmit = (data) => {
    signup(data.username, data.email, data.password);
  };

  const handeChange = () => {
    setRegErrors('');
    isRegistered && setIsRegistered(false);
  };

  if (auth.isAuthenticated) return <Redirect to="/" />;

  return (
    <Container fluid="xl">
      <NavBar />

      <Row className="justify-content-center text-secondary mt-5" style={{ paddingTop: '5vh' }}>
        <Col xs={12} sm={8} md={6} lg={5} className="border border-secondary rounded">
          <Row className="pt-3 pb-4 px-1">
            <Col sm={12} className="text-center mt-3 mb-4 h5">
              Sign Up | Register
            </Col>

            <Col sm={12}>
              <Form>
                <InputField
                  label="User Name"
                  type="text"
                  name="username"
                  register={register}
                  errors={errors.username?.message}
                  onChange={handeChange}
                />

                <InputField
                  label="Email Id"
                  type="email"
                  name="email"
                  register={register}
                  errors={errors.email?.message}
                  onChange={handeChange}
                />

                <InputField
                  label="Password"
                  type="password"
                  name="password"
                  register={register}
                  errors={errors.password?.message}
                  onChange={handeChange}
                />

                <InputField
                  label="Confirm Password"
                  type="password"
                  name="confirm_password"
                  register={register}
                  errors={errors.confirm_password?.message}
                  onChange={handeChange}
                />

                <Button variant="primary" className="mt-4" onClick={handleSubmit(onSubmit)} block>
                  Sign Up
                </Button>

                <Form.Text
                  className={
                    isRegistered ? 'text-center text-success mt-3' : 'text-center text-danger mt-3'
                  }
                >
                  {regErrors}
                </Form.Text>
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
          Already have an account? <Link to="/login">Login.</Link>
        </Col>
      </Row>
    </Container>
  );
}
