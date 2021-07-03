import React, { useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import NavBar from '../components/NavBar';
import InputField from '../components/InputField';
import { USERNAME_REGEX } from '../utils/regexExp';
import { login, auth_err_msg } from '../redux/actions';

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is Required')
    .matches(USERNAME_REGEX, 'Please Enter Valid Username'),
  password: yup.string().required('Password is Required'),
});

export default function Login() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = 'Login | AudMIX';
  }, []);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  const onSubmit = (data) => {
    dispatch(login(data.username, data.password));
  };

  const handeChange = () => dispatch(auth_err_msg(''));

  if (auth.isAuthenticated) return <Redirect to="/" />;

  return (
    <Container fluid="xl">
      <NavBar />

      <Row className="justify-content-center text-secondary mt-5" style={{ paddingTop: '8vh' }}>
        <Col xs={12} sm={8} md={6} lg={5} className="border border-secondary rounded">
          <Row className="pt-3 pb-4 px-1">
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

                <Form.Text className="text-right mb-3">
                  <Link to="/reset_password">Forgot Password?</Link>
                </Form.Text>

                <Button variant="primary" onClick={handleSubmit(onSubmit)} block>
                  Login
                </Button>

                <Form.Text className="text-center text-danger mt-3">{auth.errors}</Form.Text>
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
