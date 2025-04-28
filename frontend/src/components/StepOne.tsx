import { useState, useEffect } from "react";
import { type FieldValues, useForm } from "react-hook-form";

export default function StepOne({
  onStepComplete,
}: {
  onStepComplete: (id: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm();

  // effects
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  const onSubmit = async (data: FieldValues) => {
    try {
      const form = new FormData();
      console.log(data.content[0]);
      form.append("content", data.content[0]);

      const res = await fetch("http://localhost:3001/files/upload", {
        method: "post",
        body: form,
      });

      if (res.ok) {
        const data = await res.json();
        onStepComplete(data.id);
      } else throw new Error("failed to upload file");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <form
        action={"#"}
        onSubmit={handleSubmit(onSubmit)}
        className="block my-2 text-center"
      >
        <div className="block mx-auto">
          <input
            type="file"
            accept="video/*"
            className="bg-zinc-600 p-2 rounded-lg file:bg-zinc-800 file:p-2 file:rounded-lg"
            {...register("content", { max: 5 })}
          />
        </div>
        <button
          className="p-2 bg-zinc-600 rounded-lg font-bold hover:cursor-pointer"
          type="submit"
        >
          submit
        </button>
        {error && <p className="font-bold text-red-500">{error}</p>}
      </form>
    </div>
  );
}
