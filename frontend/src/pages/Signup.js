import React, { useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import NavBar from '../components/NavBar';
import InputField from '../components/InputField';
import { signup, auth_default, clear_err_msg } from '../redux/actions/index';

const schema = yup.object().shape({
  username: yup.string().required('Username is Required'),
  email: yup.string().required('Email Id is Required').email('Email must be a valid email'),
  password: yup.string().required('Password is Required'),
  confirm_password: yup
    .string()
    .required('Confirm Password is Required')
    .oneOf([yup.ref('password'), null], 'Password does not match'),
});

export default function Signup() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = 'Sign Up | AudMIX';
    dispatch(auth_default());
  }, []);

  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  const onSubmit = (data) => {
    dispatch(signup(data.username, data.email, data.password));
  };

  const handeChange = () =>
    auth.isRegistered ? dispatch(auth_default()) : dispatch(clear_err_msg());

  if (auth.isAuthenticated) return <Redirect to="/" />;

  if (auth.isRegistered) {
    reset();
  }

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
                    auth.isRegistered
                      ? 'text-center text-success mt-3'
                      : 'text-center text-danger mt-3'
                  }
                >
                  {auth.regErrors}
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
