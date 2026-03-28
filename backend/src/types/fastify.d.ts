import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    /** Definido pelo hook de autenticação quando há Bearer JWT válido */
    userId?: string;
  }
}
