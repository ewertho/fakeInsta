const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const template = require("../templates/email/emailConfirm");

const servico = "Ewerytime";

const transporter = nodemailer.createTransport({
  // Configura os parâmetros de conexão com servidor.
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "felixewerton49@gmail.com",
    pass: "Eweerr!12",
  },
});

function index(req, res) {}
function store(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  /**
   * necessario criar autenticação com email
   * ideia: direcionar email ao cliente levando um link para autenticação
   */

  //cria saltos para encripitar a senha
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  //ve se a senha e o campo confirme senha são realmente identicos
  if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
    return res.status(400).send({ errors: ["Senhas não conferem."] });
  }

  /**verifica se ja tem email cadastrado no sistema
   * sempre verificando possiveis erros no banco
   */
  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    } else if (user) {
      return res.status(400).send({ errors: ["Usuário já cadastrado."] });
    } else {
      //cadastro de novo usuario, passando sempre a senha encryptada
      const newUser = new User({ name, email, password: passwordHash });
      newUser.save((err) => {
        //novamente verifica se tem erros no banco
        if (err) {
          return sendErrorsFromDB(res, err);
        } else {
          /**caso cadastrado
           * passa pelo login ja levando os dados recem cadastrados
           * e automaticamente vai para a aplicação principal
           */

          const mailOptions = {
            // Define informações pertinentes ao E-mail que será enviado
            from: servico,
            to: email,
            subject: "Welcome to the new World",
            text:
              "Mais um teste pra ve se isso aqui ta funcionando, ta dificil, mas nos não desiste! .  teste do html <h1>qualquer coisa</h1>",
            html: template.sendConfirm(name, servico),
          };

          transporter.sendMail(mailOptions, (err, info) => {
            // Função que, efetivamente, envia o email.
            if (err) {
              console.log(err);
              return res.status(400).send({ erro: "houve um erro" });
            }
            console.log(info);
            return res.json({ ok: true });
          });
        }
      });
    }
  });
}
function show(req, res) {
  const { email, password, tokenStorage } = req.body;

  if (tokenStorage !== undefined) {
    if (jwt.verify(tokenStorage, process.env.AuthSecret)) {
      return res.json({ email, tokenStorage });
    }
  }
  User.findOne({ email }, (err, user) => {
    if (err) {
      console.log(err);
    } else if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ ...user }, process.env.AuthSecret, {
        expiresIn: "5 days",
      });
      const { email } = user;
      return res.json({ email, token });
    } else {
      return res.status(400).send({ errors: ["Usuário/Senha inválidos"] });
    }
  });
}
function destroy(req, res) {}
function update(req, res) {}

module.exports = { index, show, store, destroy, update };
