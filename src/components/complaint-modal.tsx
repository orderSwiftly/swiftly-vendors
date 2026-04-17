"use client";

import { useState, useRef } from "react";
import { X, Paperclip, Send } from "lucide-react";
import { CreateComplaint } from "@/lib/complaint";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";

export default function ComplaintForm() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + attachments.length > 4) {
        toast.error("You can only upload up to 4 attachments");
        return;
      }
      setAttachments((prev) => [...prev, ...files]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await CreateComplaint({ subject, content, attachments });
      toast.success("Complaint submitted successfully");
      setSubject("");
      setContent("");
      setAttachments([]);
    } catch (err) {
      console.error("Error submitting complaint:", err);
      toast.error("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--txt-clr)] rounded-2xl border border-[var(--pry-clr)]/10 shadow-sm p-6 w-full">
      <p className="text-sm text-[var(--pry-clr)]/60 sec-ff mb-6">
        Describe your issue and our team will get back to you shortly.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-[var(--pry-clr)]/50 sec-ff mb-1 uppercase tracking-wider">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full border border-[var(--pry-clr)]/15 bg-[var(--pry-clr)]/5 text-[var(--pry-clr)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)]/50 focus:border-[var(--acc-clr)] transition sec-ff placeholder:text-[var(--pry-clr)]/30"
            placeholder="e.g. Order not delivered"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-[var(--pry-clr)]/50 sec-ff mb-1 uppercase tracking-wider">
            Message
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            required
            className="w-full border border-[var(--pry-clr)]/15 bg-[var(--pry-clr)]/5 text-[var(--pry-clr)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)]/50 focus:border-[var(--acc-clr)] transition sec-ff placeholder:text-[var(--pry-clr)]/30 resize-none"
            placeholder="Describe your issue in detail..."
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-xs font-semibold text-[var(--pry-clr)]/50 sec-ff mb-2 uppercase tracking-wider">
            Attachments{" "}
            <span className="normal-case font-normal">(optional, max 4)</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border border-dashed border-[var(--bg-clr)]/50 rounded-xl text-sm text-[var(--bg-clr)] hover:border-[var(--bg-clr)] hover:bg-[var(--bg-clr)]/5 transition duration-200 sec-ff"
          >
            <Paperclip size={15} />
            Choose Files
          </button>

          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border border-[var(--pry-clr)]/10 shadow-sm"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="absolute top-1 right-1 bg-[var(--pry-clr)]/70 text-[var(--txt-clr)] rounded-full p-0.5 hover:bg-[var(--pry-clr)] transition"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--acc-clr)] text-[var(--pry-clr)] sec-ff font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <Send size={15} />
                Submit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}