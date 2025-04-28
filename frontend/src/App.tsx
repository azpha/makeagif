import { useState } from "react";

// steps
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";

export default function App() {
  const [fileId, setFileId] = useState<string | null>(null);
  const [step, setStep] = useState<number>(0);

  return (
    <div className="min-h-screen bg-black flex justify-center items-center text-white">
      <div className="border border-solid border-white rounded-lg p-2">
        {/* header */}
        {(step === 0 || step === 2) && (
          <>
            <h1 className="text-2xl font-bold text-center">make a gif</h1>
            <hr className="my-2" />
          </>
        )}

        {/* step content */}
        {step === 0 && (
          <StepOne
            onStepComplete={(id) => {
              setFileId(id);
              setStep(1);
            }}
          />
        )}
        {step === 1 && fileId && (
          <StepTwo
            id={fileId}
            onStepComplete={() => {
              setStep(2);
            }}
          />
        )}
        {step === 2 && <StepThree id={fileId!} />}
      </div>
    </div>
  );
}
