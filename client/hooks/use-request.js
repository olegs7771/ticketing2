import axios from 'axios';
import { useState } from 'react';

export default function userRequest({ url, method, body, onSuccess }) {
  const [errors, setErrors] = useState(null);
  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const res = await axios[method](url, { ...body, ...props });

      if (onSuccess) {
        onSuccess(res.data);
      }
      return res.data;
    } catch (error) {
      setErrors(
        <div className="alert alert-danger my-1">
          {error.response.data.errors.map((error) => (
            <li key={error.message}>{error.message}</li>
          ))}
        </div>,
      );
    }
  };

  return { doRequest, errors };
}
