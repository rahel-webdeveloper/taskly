import APIClient from "../services/api-client";

const apiClient = new APIClient("users");

export const useUser = (() => {
  const getUser = (userId) => {
    apiClient
      .getUserById(userId)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
})();
