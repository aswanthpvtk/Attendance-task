

import axios from "axios";

const commonApi = async (httpMethod, url, reqBody, reqHeader = {}) => {
  console.log(`Making ${httpMethod} request to: ${url}`);

  const reqConfig = {
    method: httpMethod,
    url,
    data: reqBody,
    headers: reqHeader || {},
  };

  try {
    const response = await axios(reqConfig);
    console.log("Response received:", response);
    return response;
  } catch (error) {

    if (error.response) {

      console.error("API Error Response:", error.response.data);
      console.error("Status Code:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {

      console.error("No response received:", error.request);
    } else {

      console.error("Error during request setup:", error.message);
    }
    return { error: true, message: error.message };
  }
};

export default commonApi;
