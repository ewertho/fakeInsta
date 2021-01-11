const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  validateToken(req, res, next) {
    const token = req.body.token || "";

    jwt.verify(token, proccess.env.authSecret, function (err, decoded) {
      return res.status(200).send({ valid: !err });
    });
  },

  protectedRouter(req, res, next) {
    /**verifica se a requisição é somente para ver se cors ta habilitado
     * nesses casos não é feita nenhuma validação
     * essa validação é feita somente no formato options
     */
    console.log(req);
    if (req.method === "OPTIONS") {
      next();
    } else {
      //verifica onde ta o token, se na body(put, post) ou na request(get, delete)
      const token =
        req.body.token || req.query.token || req.headers["authorization"];
      console.log(token);
      //se não houver token
      if (!token) {
        return res.status(403).send({ errors: ["No token provided."] });
      }

      jwt.verify(token, env.authSecret, function (err, decoded) {
        if (err) {
          //se token não bater com token que a aplicação disponibilizou dentro do periodo
          return res.status(403).send({
            errors: ["Failed to authenticate token."],
          });
        } else {
          //adiciona na request (não é necessario) e passa pra proxima
          //req.decoded = decoded
          next();
        }
      });
    }
  },
};
