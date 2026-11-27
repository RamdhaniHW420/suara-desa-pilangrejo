"use client";
import { useId, useState } from "react";

type Props = {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  multiline?: boolean;
  required?: boolean;
  minLength?: number;
  petunjuk?: string;
};

export default function Field({
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  multiline = false,
  required = true,
  minLength,
  petunjuk,
}: Props) {
  const id = useId();
  const [fokus, setFokus] = useState(false);
  const naik = fokus || value.length > 0;

  const kelasInput =
    "peer w-full bg-transparent pb-3 pt-7 text-[17px] text-hutan-deep outline-none placeholder:text-transparent focus-visible:outline-none";

  return (
    <div className="group relative">
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-0 origin-left transition-all duration-300 ease-out ${
          naik ? "top-0 text-[13px] font-semibold text-bata" : "top-7 text-[17px] text-lumut"
        }`}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFokus(true)}
          onBlur={() => setFokus(false)}
          required={required}
          minLength={minLength}
          rows={5}
          className={`${kelasInput} resize-y`}
          aria-describedby={petunjuk ? `${id}-p` : undefined}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFokus(true)}
          onBlur={() => setFokus(false)}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          className={kelasInput}
          aria-describedby={petunjuk ? `${id}-p` : undefined}
        />
      )}
      <span aria-hidden="true" className="block h-px w-full bg-hutan/30" />
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 block h-[2px] bg-bata transition-[width] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          fokus ? "w-full" : "w-0"
        }`}
      />
      {petunjuk && (
        <p id={`${id}-p`} className="mt-2 text-[13px] text-lumut">
          {petunjuk}
        </p>
      )}
    </div>
  );
}
