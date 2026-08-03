# Mapa de Performance Digital — Oxford Soluções Digitais

Isca digital gamificada para captar e qualificar leads via tráfego pago.
O visitante responde 11 perguntas simples e recebe um relatório com nota por
eixo do funil, o gargalo principal identificado e um convite para a sessão
estratégica com a Oxford.

**HTML, CSS e JavaScript puro.** Sem build, sem framework, sem dependência.
Quatro arquivos.

```
index.html    landing (renderiza no primeiro paint, sem depender do JS)
styles.css    tokens da marca Oxford + componentes
app.js        perguntas, pontuação, textos do diagnóstico e telas
api/lead.js   função serverless opcional que repassa o lead ao webhook
```

## Rodar localmente

Qualquer servidor estático serve:

```bash
python3 -m http.server 4000
# abre http://localhost:4000
```

A função `api/lead.js` não roda assim — o envio do lead falha em silêncio e o
relatório aparece normalmente. Para testar a função junto, use `vercel dev`.

## Publicar na Vercel

O projeto é zero-config. A Vercel serve os estáticos e detecta `/api`
automaticamente.

```bash
npx vercel        # preview
npx vercel --prod # produção
```

Ou conecte o repositório pelo painel da Vercel e faça deploy pelo push.

## O que configurar

**1. Número do WhatsApp** — em `app.js`, no objeto `CONFIG` no topo:

```js
const CONFIG = {
  whatsapp: "5511999999999", // 55 + DDD + número, só dígitos
  leadEndpoint: "/api/lead",
};
```

**2. Destino do lead** (opcional) — defina `LEAD_WEBHOOK_URL` nas variáveis de
ambiente do projeto na Vercel, apontando para n8n, Make, Zapier, CRM ou Google
Sheets. Sem isso, o lead ainda aparece nos logs da Vercel.

O payload enviado:

```json
{
  "nome": "...", "empresa": "...", "whatsapp": "...", "email": "...",
  "notaGeral": 37, "classificacao": "critico",
  "gargalo": "Conversão", "notaGargalo": 20, "pontoForte": "Retenção",
  "notasPorEixo": { "Atração": 45, "Conversão": 20, "Retenção": 48, "Operação": 40 },
  "temperatura": "quente", "leadScore": 6,
  "respostas": { "origem-clientes": "Indicação e redes sociais no orgânico", "...": "..." }
}
```

## Como o diagnóstico funciona

**Quatro eixos** compõem o mapa: Atração, Conversão, Retenção e Operação.
Cada alternativa de resposta carrega uma nota de 0 a 100 (`score`). A nota do
eixo é a média das suas perguntas; a nota geral é a média ponderada dos eixos
(atração e conversão pesam 30% cada, retenção e operação 20% cada).

**Faixas:** abaixo de 40 é crítico, abaixo de 65 é atenção, daí para cima é
saudável.

**O gargalo** é o eixo com a menor nota. Em caso de empate vale a ordem de
`BOTTLENECK_PRIORITY` — conversão vem antes de atração de propósito, porque não
adianta colocar mais gente no topo de um funil que vaza.

**A temperatura comercial** (`leadScore`, 0 a 6) é calculada em separado, a
partir das três perguntas de prontidão: satisfação, urgência e disposição a
investir. Ela nunca aparece para o lead — serve só para você priorizar quem
chamar primeiro. Cinco ou mais é quente.

## Como editar

Tudo que é conteúdo está em `app.js`, em blocos comentados:

| Bloco | O que muda |
|---|---|
| `CONFIG` | WhatsApp e endpoint do lead |
| `QUESTIONS` | perguntas, alternativas e as notas de cada uma |
| `AXIS_WEIGHT` | peso de cada eixo na nota geral |
| `BOTTLENECK_PRIORITY` | ordem de desempate do gargalo |
| `AXIS_VERDICT` | leitura curta de cada eixo, por faixa |
| `BOTTLENECK_DIAGNOSIS` | diagnóstico longo de cada gargalo |
| `OVERALL_VERDICT` | leitura da nota geral, por faixa |

Para acrescentar uma pergunta que pontua um eixo, basta incluir o objeto em
`QUESTIONS` com `axis` e um `score` em cada alternativa — a média se ajusta
sozinha. Sem `axis`, a pergunta só qualifica e não mexe no mapa.

## Os gráficos do relatório

São três, e cada um responde uma pergunta diferente — não repetem o mesmo dado:

| Gráfico | Responde | Onde fica |
|---|---|---|
| **Medidor em arco** | "Quão bem eu estou, no geral?" | `gaugeSvg()` |
| **Radar** | "Meu funil é equilibrado? Onde estou longe do saudável?" | `radarSvg()` |
| **Barras** | "Qual a nota exata de cada eixo?" | direto em `showReport()` |

Tudo é SVG gerado na mão, sem biblioteca de gráficos. O radar sobrepõe duas
formas: a do negócio e a de uma operação saudável (`RADAR_BENCHMARK`, 75 em
todos os eixos, tracejada). O buraco entre as duas é o argumento visual da
isca.

## Notas de implementação

- As cores dos dados (`#4f66b8` azul Oxford e `#d97757` terracota) foram
  validadas para daltonismo: ΔE 20.6 em protanopia, 27.5 em visão normal.
  O gargalo também é marcado por rótulo, legenda e posição — nunca só por cor.
- Cada gráfico tem `aria-label` com os valores em texto, para leitor de tela.
- O relatório imprime em PDF pelo botão no rodapé (`@media print` já remove o
  CTA e ajusta as cores).
- `prefers-reduced-motion` desliga as animações de entrada, de barra e do arco.
- Nome, empresa e e-mail são escapados antes de entrar no HTML.
- Acima de 720px a nota e o mapa dividem a mesma linha; abaixo disso empilham.
