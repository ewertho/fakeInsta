function sendConfirm(name, servico) {
  const html = `<p>Oi, ${name}</p>
    <br>
    <p>Sua conta no(a) ${servico} está quase pronta. 
        Para ativá-la, por favor confirme o seu endereço de email clicando no link abaixo.</p>
    <p>
        <button>
            <a>Ativar minha conta/Confirmar meu email</a>
        </button>
    </p>
    <p>Sua conta não será ativada até que seu email seja confirmado.</p>
    <p>Se você não se cadastrou no(a) ${servico} recentemente, por favor ignore este email.</p>`;

  return html;
}

module.exports = { sendConfirm };
