import axios from 'axios';
import { baseUrl } from './baseUrl';

export const sendCertificate = async (crtFile) => {
  const formData = new FormData();
  formData.append('file', new Blob([crtFile], { type: 'application/x-x509-ca-cert' }), crtFile?.name);

  const option = {
    headers: {
      'accept': '*/*',
      'accept_language': localStorage.getItem("lang"),
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  try {
    const response = await axios.post( baseUrl +`Store/AddCertificate`, formData,option);
    return response
  } catch (error) {
    return error.response
  }
};
