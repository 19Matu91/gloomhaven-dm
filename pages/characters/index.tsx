import { useEffect } from "react";
import { useRouter } from "next/router";

const Characters = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/characters/DE");
  }, []);
  return null;
};

export default Characters;
