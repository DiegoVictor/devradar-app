import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import PropTypes from 'prop-types';

export default function Input({ name, type, ...rest }) {
  const inputRef = useRef(null);
  const { fieldName, defaultValue = '', registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  if (type === 'textarea') {
    return <textarea ref={inputRef} defaultValue={defaultValue} {...rest} />;
  }

  return <input ref={inputRef} defaultValue={defaultValue} {...rest} />;
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
};
