import { useState } from "react";

export default function StepThree({ id }: { id: string }) {
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const pollForFile = async () => {
    if (!hasLoaded) {
      const res = await fetch("http://localhost:3001/files/edited/" + id);
      if (res.ok) {
        setHasLoaded(true);
      }
    } else {
      console.error("maximum poll exceeded");
    }
  };

  const interval = setInterval(() => {
    console.log(hasLoaded);
    if (!hasLoaded) {
      pollForFile();
    } else {
      clearInterval(interval);
    }
  }, 5000);

  return (
    <div>
      {hasLoaded && <img src={"http://localhost:3001/files/edited/" + id} />}
    </div>
  );
}
