import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useNavigateTo = () => {
  const navigate = useNavigate();

  return useCallback(
    (path: string) => {
      window.scrollTo(0, 0);
      navigate(path);
    },
    [navigate],
  );
};
