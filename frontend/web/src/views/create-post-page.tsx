import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../lib/api";

export function CreatePostPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      setError("Selecione uma imagem.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("caption", caption);

    setIsSubmitting(true);
    setError(null);

    try {
      await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/");
    } catch {
      setError("É preciso estar logado e a API precisa estar disponível.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold text-white">Nova publicação</h1>

      <form onSubmit={onSubmit} className="space-y-5 rounded-lg border border-[#262626] bg-black p-6">
        <label className="block space-y-2">
          <span className="text-sm text-[#a8a8a8]">Foto</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            className="block w-full text-sm text-[#a8a8a8] file:mr-4 file:rounded-md file:border-0 file:bg-[#0095f6] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-[#a8a8a8]">Legenda</span>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            placeholder="Escreva uma legenda…"
            className="w-full rounded-md border border-[#262626] bg-[#121212] px-3 py-2 text-sm text-white outline-none placeholder:text-[#737373]"
            required
          />
        </label>

        {error ? <p className="text-sm text-[#ed4956]">{error}</p> : null}

        <button
          type="submit"
          disabled={!selectedFile || isSubmitting}
          className="w-full rounded-lg bg-[#0095f6] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? "Compartilhando…" : "Compartilhar"}
        </button>
      </form>
    </section>
  );
}
