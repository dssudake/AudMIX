import React from 'react';
import PropTypes from 'prop-types';

import { Form } from 'react-bootstrap';

export default function InputField({ label, type, register, errors, ...inputProps }) {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control ref={register} type={type} {...inputProps} />
        <Form.Text className="text-danger">{errors}</Form.Text>
      </Form.Group>
    </>
  );
}

InputField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  register: PropTypes.func,
  errors: PropTypes.string,
  inputProps: PropTypes.object,
};
