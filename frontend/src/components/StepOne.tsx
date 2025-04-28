import { useState, useEffect, type RefObject } from "react";

export default function StepOne({
  ref,
  onStepComplete,
}: {
  ref: RefObject<HTMLInputElement | null>;
  onStepComplete: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  // effects
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  const onSubmit = () => {
    if (ref.current?.files && ref.current.files[0]) {
      onStepComplete();
    } else {
      console.error("no file provided!");
      setError("provide a file");
    }
  };

  return (
    <div>
      <div className="block mx-auto">
        <input
          type="file"
          ref={ref}
          accept="video/*"
          className="bg-zinc-600 p-2 rounded-lg file:bg-zinc-800 file:p-2 file:rounded-lg"
        />
      </div>
      <div className="block my-2 text-center">
        <button
          className="p-2 bg-zinc-600 rounded-lg font-bold hover:cursor-pointer"
          type="button"
          onClick={onSubmit}
        >
          submit
        </button>
        {error && <p className="font-bold text-red-500">{error}</p>}
      </div>
    </div>
  );
}
