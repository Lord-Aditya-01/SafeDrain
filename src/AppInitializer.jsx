import { useEffect } from "react";
import { workersData } from "./services/workersData";

const AppInitializer = () => {

  useEffect(() => {

    const existing = localStorage.getItem("workersLiveData");

    if (!existing) {

      const initial = {};

      workersData.forEach(worker => {
        initial[worker.id] = worker;
      });

      localStorage.setItem(
        "workersLiveData",
        JSON.stringify(initial)
      );
    }

  }, []);

  return null; // no UI
};

export default AppInitializer;
