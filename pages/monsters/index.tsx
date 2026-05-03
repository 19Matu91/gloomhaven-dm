import { useEffect } from "react";
import { useRouter } from "next/router";

const Monsters = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/monsters/black-imp");
  }, []);
  return null;
};

export default Monsters;
