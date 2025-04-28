import { useState, useRef } from "react";

// steps
import StepOne from "./components/StepOne";

export default function App() {
  const [step, setStep] = useState<number>(0);
  const imageRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-black flex justify-center items-center text-white">
      <div className="border border-solid border-white rounded-lg p-2">
        {/* header */}
        <h1 className="text-2xl font-bold text-center">make a gif</h1>
        <hr className="my-2" />

        {/* step content */}
        {step === 0 && (
          <StepOne ref={imageRef} onStepComplete={() => setStep(1)} />
        )}
      </div>
    </div>
  );
}
