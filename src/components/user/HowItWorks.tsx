export function HowItWorks() {
  const steps = [
    { icon: '1️⃣', title: 'Entre no bolão', desc: 'Use o código do seu gerente para acessar os bolões disponíveis.' },
    { icon: '2️⃣', title: 'Escolha um bolão', desc: 'Veja os jogos com bolão aberto, o valor do palpite e as regras.' },
    { icon: '3️⃣', title: 'Faça seu palpite', desc: 'Escolha o placar exato que você acredita. Atenção ao limite de palpites iguais!' },
    { icon: '4️⃣', title: 'Pague ao gerente', desc: 'Após apostar, pague o valor ao gerente (Pix, dinheiro, etc). Ele valida seu palpite.' },
    { icon: '5️⃣', title: 'Aguarde o jogo', desc: 'Acompanhe o placar e os palpites dos outros participantes.' },
    { icon: '6️⃣', title: 'Resultado', desc: 'Se você acertar o placar exato, ganha o prêmio! O valor é dividido entre os acertadores.' },
  ];

  const rules = [
    { icon: '🎯', text: 'Apenas o placar exato ganha. Quem chegar perto não conta.' },
    { icon: '🔄', text: 'Cada placar tem um limite de palpites iguais (ex: máx. 3 pessoas com 2x1).' },
    { icon: '⏰', text: 'Existe um prazo para apostar. Após o horário, não aceita mais palpites.' },
    { icon: '⚽', text: 'O gerente define se vale apenas tempo normal (90 min) ou se inclui prorrogação.' },
    { icon: '🚫', text: 'Pênaltis NUNCA contam, mesmo que o gerente marque "com prorrogação".' },
    { icon: '💰', text: 'O gerente cobra uma taxa de manutenção (%). O restante vai para o prêmio.' },
    { icon: '🏆', text: 'Se mais de uma pessoa acertar, o prêmio é dividido igualmente.' },
    { icon: '😔', text: 'Se ninguém acertar, o valor fica com o gerente (pode virar bônus do próximo).' },
    { icon: '✅', text: 'Seu palpite só vale depois que o gerente confirmar o pagamento.' },
  ];

  return (
    <div className="space-y-4">
      {/* Como funciona */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>📖</span> Como Funciona
        </h2>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-2xl shrink-0">{step.icon}</span>
              <div>
                <div className="font-semibold text-gray-800">{step.title}</div>
                <div className="text-sm text-gray-500">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regras */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📋</span> Regras do Bolão
        </h2>
        <div className="space-y-3">
          {rules.map((rule, i) => (
            <div key={i} className="flex gap-2 items-start p-2 bg-gray-50 rounded-lg">
              <span className="text-lg shrink-0">{rule.icon}</span>
              <span className="text-sm text-gray-700">{rule.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dica */}
      <div className="card bg-gradient-to-r from-green-50 to-yellow-50 border-2 border-green-200">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💡</span>
          <div>
            <div className="font-bold text-gray-800">Dica!</div>
            <div className="text-sm text-gray-600">
              Antes de apostar, veja os palpites que já foram feitos. 
              Assim você evita escolher um placar que já atingiu o limite 
              e pode apostar em um placar que ninguém escolheu ainda!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
