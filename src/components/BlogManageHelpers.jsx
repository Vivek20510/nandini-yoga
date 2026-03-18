import React from "react";
import { AlertCircle, Check } from "lucide-react";

export const Card = ({ title, children, accent = "warm" }) => (
  <div
    className={`rounded-2xl border p-5 shadow-sm ${
      accent === "soft"
        ? "border-[#e0d6c6] bg-[#fffdf9]"
        : "border-[#d7ccbc] bg-[#FDFAF5]"
    }`}
  >
    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B8724A]">
      {title}
    </p>
    {children}
  </div>
);

export const Field = ({ label, children, hint }) => (
  <label className="block">
    <div className="mb-2 flex items-center justify-between gap-3">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B8724A]">
        {label}
      </span>
      {hint ? (
        <span className="text-[10px] uppercase tracking-[0.12em] text-[#9b8a79]">
          {hint}
        </span>
      ) : null}
    </div>
    {children}
  </label>
);

export const Alert = ({ kind, text }) => (
  <div
    className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
      kind === "error"
        ? "border-[#e0b4ab] bg-[#fff2ef] text-[#b34f3a]"
        : "border-[#b7d4c0] bg-[#eff9f2] text-[#4f7b5d]"
    }`}
  >
    {kind === "error" ? <AlertCircle size={15} /> : <Check size={15} />}
    <span>{text}</span>
  </div>
);
