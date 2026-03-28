import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { api } from "../lib/api";

const createPostSchema = z.object({
  author: z.string().min(2, "Informe quem publicou."),
  place: z.string().optional(),
  description: z.string().min(2, "Adicione uma descrição."),
  hashtags: z.string().optional(),
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;

export function CreatePostPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
  });

  async function onSubmit(values: CreatePostFormValues) {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("author", values.author);
    formData.append("place", values.place ?? "");
    formData.append("description", values.description);
    formData.append("hashtags", values.hashtags ?? "");

    setIsSubmitting(true);

    try {
      await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
        <p className="text-sm uppercase tracking-[0.3em] text-orange-200/70">Publicar</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-50">
          Monte um post novo com validação tipada.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-stone-300">
          O formulário agora usa TypeScript, `react-hook-form` e `zod`, com payload coerente com a API nova.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-[2rem] border border-white/10 bg-stone-900/80 p-6 shadow-2xl shadow-black/30"
      >
        <label className="block space-y-3">
          <span className="text-sm font-medium text-stone-200">Imagem</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            className="block w-full rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-6 text-sm text-stone-300 file:mr-4 file:rounded-full file:border-0 file:bg-orange-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-stone-950"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-stone-200">Autor</span>
            <input
              {...register("author")}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-stone-100 outline-none transition focus:border-orange-300/50"
            />
            {errors.author ? <span className="text-sm text-rose-300">{errors.author.message}</span> : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-stone-200">Local</span>
            <input
              {...register("place")}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-stone-100 outline-none transition focus:border-orange-300/50"
            />
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-stone-200">Descrição</span>
          <textarea
            {...register("description")}
            rows={5}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-stone-100 outline-none transition focus:border-orange-300/50"
          />
          {errors.description ? (
            <span className="text-sm text-rose-300">{errors.description.message}</span>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-stone-200">Hashtags</span>
          <input
            {...register("hashtags")}
            placeholder="#typescript #tailwind #fastify"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-stone-100 outline-none transition focus:border-orange-300/50"
          />
        </label>

        <button
          type="submit"
          disabled={!selectedFile || isSubmitting}
          className="w-full rounded-2xl bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 px-4 py-3 font-semibold text-stone-950 transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Enviando..." : "Publicar"}
        </button>
      </form>
    </section>
  );
}
