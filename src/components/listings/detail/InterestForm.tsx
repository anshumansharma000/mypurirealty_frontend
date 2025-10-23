"use client";

import React, { useState } from "react";

export type InterestFormValues = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
};

type Props = {
  onSubmit: (form: InterestFormValues) => void;
  submitting?: boolean;
  error?: string | null;
};

export default function InterestForm({ onSubmit, submitting = false, error }: Props) {
  const [form, setForm] = useState<InterestFormValues>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as keyof InterestFormValues]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed: InterestFormValues = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email?.trim(),
      message: form.message?.trim(),
    };
    onSubmit({
      ...trimmed,
      email: trimmed.email ? trimmed.email : undefined,
      message: trimmed.message ? trimmed.message : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-neutral-800">Name</label>
        <input
          type="text"
          name="name"
          required
          disabled={submitting}
          value={form.name}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-800">Phone number</label>
        <input
          type="tel"
          name="phone"
          required
          disabled={submitting}
          value={form.phone}
          onChange={handleChange}
          placeholder="e.g. 9876543210"
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-800">Email (optional)</label>
        <input
          type="email"
          name="email"
           disabled={submitting}
          value={form.email}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-800">Message</label>
        <textarea
          name="message"
          rows={3}
          disabled={submitting}
          value={form.message}
          onChange={handleChange}
          placeholder="I’m interested in this property..."
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 w-full rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Submitting..." : "Submit Interest"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
