import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/auth-context";
import { api } from "../lib/api";

export function RegisterPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/signup", {
        username,
        fullName,
        email,
        password,
        confirmPassword,
      });

      await signIn(email, password);
      navigate("/");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(message ?? "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-[350px] rounded-xl border border-[#262626] bg-black px-10 py-10">
        <h1 className="mb-6 text-center text-4xl font-semibold text-white">FakeInsta</h1>
        <p className="mb-6 text-center text-sm text-[#a8a8a8]">Cadastre-se para ver fotos dos seus amigos.</p>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-md border border-[#262626] bg-[#121212] px-3 py-2 text-sm text-white outline-none placeholder:text-[#737373]"
            required
          />
          <input
            placeholder="Nome completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-md border border-[#262626] bg-[#121212] px-3 py-2 text-sm text-white outline-none placeholder:text-[#737373]"
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-[#262626] bg-[#121212] px-3 py-2 text-sm text-white outline-none placeholder:text-[#737373]"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-[#262626] bg-[#121212] px-3 py-2 text-sm text-white outline-none placeholder:text-[#737373]"
            required
          />
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="rounded-md border border-[#262626] bg-[#121212] px-3 py-2 text-sm text-white outline-none placeholder:text-[#737373]"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-[#0095f6] py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Criando..." : "Cadastre-se"}
          </button>
        </form>

        {error ? <p className="mt-4 text-center text-sm text-[#ed4956]">{error}</p> : null}

        <p className="mt-6 text-center text-sm text-[#a8a8a8]">
          Tem uma conta?{" "}
          <Link to="/login" className="font-semibold text-[#0095f6]">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
