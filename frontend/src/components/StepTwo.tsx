import Player from "./Player";

export default function StepTwo({
  id,
  onStepComplete,
}: {
  id: string;
  onStepComplete: () => void;
}) {
  return (
    <Player
      onStepComplete={onStepComplete}
      id={id}
      url={"http://localhost:3001/files/" + id}
    />
  );
}
