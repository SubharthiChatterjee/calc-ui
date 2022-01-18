import useAxios from "axios-hooks";

export const API_POINTS = {
  LOGS: {
    url: "logs",
    method: "GET",
  },
  UPDATE_LOGS: {
    url: "calc",
    method: "POST",
  },
  REGISTER: {
    url: "register",
    method: "POST",
  },
};

export const useApi = (args) => {
  const token = localStorage.getItem("_h");
  const payload = {
    ...args,
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  const [, apiCaller] = useAxios(payload);

  return apiCaller;
};
