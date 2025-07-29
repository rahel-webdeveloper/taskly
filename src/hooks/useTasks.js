import { router } from "../routes";
import APIClient from "../services/api-client";
import { tasks } from "../tasks/store";

const apiClient = new APIClient("tasks");

export const useTasks = (() => {
  const getUserTasks = (userId) => {
    apiClient
      .getTasks(userId)
      .then((res) => {
        if (res.success) {
          console.log(res.data);

          router.navigate("/");
        }
      })
      .catch((err) => {
        if (err.statusText === "Unauthorized") {
          router.navigate("/sign-in");
        }
      });
  };

  return { getUserTasks };
})();
