/**
 * Função serverless da Vercel — registra o lead e repassa para o webhook.
 *
 * Opcional: sem ela a isca continua funcionando (o envio falha em silêncio
 * e o relatório aparece normalmente). Com ela, a URL do webhook fica no
 * servidor em vez de exposta no JavaScript da página.
 *
 * Configure LEAD_WEBHOOK_URL nas variáveis de ambiente do projeto na Vercel.
 */

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const lead = req.body;

  if (!lead || !lead.email || !lead.whatsapp) {
    return res.status(400).json({ ok: false, error: "missing_fields" });
  }

  // Aparece nos logs da Vercel mesmo sem webhook configurado.
  console.log(
    `[lead] ${String(lead.temperatura).toUpperCase()} · ${lead.empresa} · ${lead.nome} · nota ${lead.notaGeral} · gargalo ${lead.gargalo}`
  );

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    } catch (error) {
      // O lead já está no log — não derruba a resposta para o usuário.
      console.error("[lead] webhook falhou:", error);
    }
  }

  return res.status(200).json({ ok: true });
};
