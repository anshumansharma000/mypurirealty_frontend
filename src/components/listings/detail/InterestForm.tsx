"use client";

import React, { useState } from "react";

type Props = {
  onSubmit: (form: { name: string; phone: string; email?: string; message?: string }) => void;
};

export default function InterestForm({ onSubmit }: Props) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-neutral-800">Name</label>
        <input
          type="text"
          name="name"
          required
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
          value={form.message}
          onChange={handleChange}
          placeholder="I’m interested in this property..."
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <button
        type="submit"
        className="mt-2 w-full rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600"
      >
        Submit Interest
      </button>
    </form>
  );
}
