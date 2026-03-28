import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/auth-context";

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/");
    } catch {
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-[350px] rounded-xl border border-[#262626] bg-black px-10 py-12">
        <h1 className="mb-8 text-center font-[family-name:system-ui] text-4xl font-semibold tracking-tight text-white">
          FakeInsta
        </h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            autoComplete="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-[#262626] bg-[#121212] px-3 py-2 text-sm text-white outline-none placeholder:text-[#737373] focus:border-[#a8a8a8]"
            required
          />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-[#262626] bg-[#121212] px-3 py-2 text-sm text-white outline-none placeholder:text-[#737373] focus:border-[#a8a8a8]"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-[#0095f6] py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {error ? <p className="mt-4 text-center text-sm text-[#ed4956]">{error}</p> : null}

        <p className="mt-8 text-center text-sm text-[#a8a8a8]">
          Não tem uma conta?{" "}
          <Link to="/register" className="font-semibold text-[#0095f6]">
            Cadastre-se
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-[#737373]">
          Conta demo: alice@demo.com / demo1234
        </p>
      </div>
    </div>
  );
}
