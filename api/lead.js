/**
 * Função serverless da Vercel — registra o lead, cadastra no CRM e repassa
 * para o webhook opcional.
 *
 * Nada aqui bloqueia o relatório do visitante: falhas de CRM e de webhook
 * são logadas e engolidas, o fetch do app.js nem espera a resposta.
 *
 * Configure nas variáveis de ambiente do projeto na Vercel:
 *   CRM_API_URL      — ex.: https://crm-iota-one-32.vercel.app
 *   CRM_API_KEY       — chave "oxk_..." gerada em Configurações -> API do CRM
 *   CRM_LIST_ID       — opcional; sem isso usa a lista
 *                        "Leads - Mapa da performance digital" já existente
 *   LEAD_WEBHOOK_URL  — opcional, para n8n/Make/Zapier/planilha
 */

// "Leads - Mapa da performance digital", criada no CRM antes desta integração.
const CRM_LIST_ID_DEFAULT = "d655ebe4-8735-4dd2-b067-736f2153081f";

function withoutEmpty(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

async function syncToCRM(lead) {
  const baseUrl = process.env.CRM_API_URL;
  const apiKey = process.env.CRM_API_KEY;
  if (!baseUrl || !apiKey) return;

  const listId = process.env.CRM_LIST_ID || CRM_LIST_ID_DEFAULT;
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` };
  const utms = lead.utms || {};

  // upsert=email: mesma pessoa refazendo o teste atualiza o contato em vez
  // de duplicar. As tags são unidas com as que o contato já tiver no CRM.
  const contactRes = await fetch(`${baseUrl}/api/v1/contacts?upsert=email`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: lead.nome,
      email: lead.email,
      phone: lead.whatsapp,
      company: lead.empresa,
      tags: ["Lead"],
      custom_fields: withoutEmpty({
        source: utms.utm_source,
        medium: utms.utm_medium,
        campaign: utms.utm_campaign,
        term: utms.utm_term,
        content: utms.utm_content,
        mapa_nota_geral: lead.notaGeral,
        mapa_classificacao: lead.classificacao,
        mapa_gargalo: lead.gargalo,
        mapa_nota_gargalo: lead.notaGargalo,
        mapa_ponto_forte: lead.pontoForte,
        mapa_temperatura: lead.temperatura,
        mapa_lead_score: lead.leadScore,
        mapa_respostas: lead.respostasTexto,
        mapa_link_resultado: lead.linkResultado,
      }),
    }),
  });

  if (!contactRes.ok) {
    throw new Error(`CRM contacts ${contactRes.status}: ${await contactRes.text()}`);
  }
  const { data: contact } = await contactRes.json();

  const memberRes = await fetch(`${baseUrl}/api/v1/lists/${listId}/members`, {
    method: "POST",
    headers,
    body: JSON.stringify({ contact_ids: [contact.id] }),
  });

  if (!memberRes.ok) {
    throw new Error(`CRM list members ${memberRes.status}: ${await memberRes.text()}`);
  }
}

async function forwardToWebhook(url, lead) {
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const lead = req.body;

  if (!lead || !lead.email || !lead.whatsapp) {
    return res.status(400).json({ ok: false, error: "missing_fields" });
  }

  // Aparece nos logs da Vercel mesmo sem CRM nem webhook configurados.
  console.log(
    `[lead] ${String(lead.temperatura).toUpperCase()} · ${lead.empresa} · ${lead.nome} · nota ${lead.notaGeral} · gargalo ${lead.gargalo}`
  );

  const webhook = process.env.LEAD_WEBHOOK_URL;
  const results = await Promise.allSettled([
    syncToCRM(lead),
    webhook ? forwardToWebhook(webhook, lead) : Promise.resolve(),
  ]);
  for (const result of results) {
    if (result.status === "rejected") console.error("[lead] falha ao sincronizar:", result.reason);
  }

  return res.status(200).json({ ok: true });
};
