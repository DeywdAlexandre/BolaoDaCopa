# 🏆 Guia de Continuidade - Bolão da Copa 2026

Este documento serve como bússola para o próximo encontro, detalhando o estado atual do sistema e as prioridades de implementação.

## ✅ O que já realizamos hoje:
1.  **Migração Supabase:** Saímos do `localStorage` e agora todos os dados (Jogos, Bolões, Apostas, Gerentes) são persistidos no banco de dados Supabase em tempo real.
2.  **Deploy Vercel:** O projeto está online em `bolaodacopa-2026.vercel.app`.
3.  **Ponte de API (Vercel Proxy):** Criamos um servidor seguro na Vercel para conversar com a API de Futebol, resolvendo erros de CORS e escondendo as chaves de API.
4.  **Tabela Oficial FIFA 2026:** Implementamos o calendário real pesquisado, com 48 seleções e 72 jogos da fase de grupos, divididos em 12 grupos (A ao L).
5.  **Gestão Administrativa Premium:**
    *   Filtro inteligente por **Datas** na aba de Placares.
    *   Botão de **Gerar Tabela 2026** (Plano B para quando a API estiver limitada).
    *   Ajustes de segurança (RLS) para permitir a gestão dos dados.

---

## 🚀 Próximos Passos (Prioridades):

### 1. 🔑 Login Real com Google (PRIORIDADE MÁXIMA)
*   Substituir o `AuthContext` simulado pela autenticação real do Supabase.
*   Configurar o domínio da Vercel no Google Cloud Console.
*   Garantir que o `SuperAdmin` continue sendo o email `deywd12@gmail.com`.

### 2. 🛡️ Refinamento de Segurança (RLS)
*   Criar políticas finas no Supabase para que um usuário não consiga editar palpites de outro.
*   Garantir que apenas o SuperAdmin possa usar os botões de sincronização e geração de tabela.

### 3. 📈 Lógica de Mata-Mata
*   Implementar a lógica que "puxa" os melhores classificados dos grupos para a Fase de 32, Oitavas, etc.

### 4. 🎨 Polimento Visual (Premium UI)
*   Adicionar micro-animações nas transições de telas.
*   Melhorar o feedback visual ao salvar um palpite.

---

**📌 Quando você voltar, basta abrir este arquivo ou me pedir para ler o Guia que eu saberei exatamente por onde começar!**

Até a próxima! ⚽🏆✨
