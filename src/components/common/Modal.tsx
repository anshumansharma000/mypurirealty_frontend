"use client";

import { X } from "lucide-react";
import React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white p-5 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-neutral-500 hover:bg-neutral-100"
        >
          <X className="h-4 w-4" />
        </button>

        {title && <h2 className="mb-4 text-lg font-semibold text-neutral-900">{title}</h2>}

        {children}
      </div>
    </div>
  );
}
