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

**3. Google Tag Manager** (opcional) — em `index.html`, no topo do `<head>`:

```js
window.GTM_ID = ""; // "GTM-XXXXXXX"
```

Vazio, a tag não carrega e nenhuma requisição sai. O `dataLayer` existe do
mesmo jeito, então os eventos abaixo são disparados sempre — e o GTM lê o
histórico inteiro quando carregar.

## Eventos no dataLayer

Três eventos cobrem o funil da isca. No GTM cada um vira um acionador do tipo
**Evento personalizado** com o nome exato; os campos viram **variáveis da
camada de dados** com o mesmo nome.

| Evento | Quando dispara | Campos |
|---|---|---|
| `isca_inicio` | clique em "Começar meu diagnóstico" | `total_perguntas` |
| `isca_conclusao` | formulário validado, antes do relatório aparecer | `nota_geral`, `classificacao`, `gargalo`, `temperatura`, `lead_score`, `tipo_negocio`, `faturamento`, `investimento_atual`, `disposicao_investir` |
| `isca_whatsapp` | clique em "Agendar minha sessão estratégica" | `gargalo`, `nota_geral`, `temperatura` |

`isca_conclusao` é a conversão a otimizar nas campanhas — é onde o lead entra
na base. `isca_whatsapp` é intenção comercial e costuma ser bem mais raro;
serve para medir a qualidade do tráfego, não para otimizar (volume baixo demais
para o algoritmo aprender).

Dividir `isca_conclusao` por `isca_inicio` dá a taxa de conclusão do quiz, que
é o número para julgar se o criativo está trazendo a pessoa certa.

**Nenhum evento leva nome, e-mail ou telefone** — só dado de qualificação. O
GA4 proíbe dado pessoal na camada de dados e suspende conta por isso. Quem
recebe o contato é o webhook do lead, pelo servidor.

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

São cinco, e cada um responde uma pergunta diferente — nenhum repete o dado
do outro:

| Gráfico | Responde | Onde fica |
|---|---|---|
| **Medidor em arco** | "Quão bem eu estou, no geral?" | `gaugeSvg()` |
| **Radar** | "Meu funil é equilibrado? Quão longe estou do saudável?" | `radarSvg()` |
| **Barras por eixo** | "Qual a nota exata de cada eixo?" | `showReport()` |
| **Ranking de impacto** | "Por onde eu começo?" | `impactChart()` |
| **Projeção da nota** | "Quanto eu ganho se corrigir isso?" | `projectionChart()` |

Tudo é SVG e HTML gerados na mão, sem biblioteca de gráficos.

O **medidor** é graduado de 10 em 10, com a marca da operação saudável, para o
número ser lido contra uma régua e não sozinho. O **radar** sobrepõe duas
formas — a do negócio e a de uma operação saudável (`BENCHMARK`, 75 em todos os
eixos, tracejada); o buraco entre elas é o argumento visual da isca.

O **ranking de impacto** é a única análise que não sai direto das respostas:

```
impacto do eixo = peso do eixo × (BENCHMARK − nota do eixo)
```

Ou seja, quantos pontos da nota geral aquele eixo devolve se for levado até o
nível saudável. Isso importa porque **o eixo mais fraco nem sempre é o de maior
retorno** — um eixo de peso alto um pouco abaixo do saudável pode valer mais do
que um eixo de peso baixo lá no fundo. A soma de todos os impactos sempre fecha
em `BENCHMARK − nota geral`, e eixos já no nível aparecem sem barra e sem número
inventado. A **projeção** aplica só o primeiro item da lista.

## Notas de implementação

- As cores dos dados (`#4f66b8` azul Oxford e `#d97757` terracota) foram
  validadas para daltonismo: ΔE 20.6 em protanopia, 27.5 em visão normal.
  O gargalo também é marcado por rótulo, legenda e posição — nunca só por cor.
- Cada gráfico tem `aria-label` com os valores em texto, para leitor de tela.
- A isca não oferece impressão nem envio do mapa por e-mail — o relatório vive
  na tela e o próximo passo é o WhatsApp. O `@media print` continua ali só para
  quem usar o atalho do navegador não receber uma página quebrada.
- `prefers-reduced-motion` desliga as animações de entrada, de barra e do arco.
- Nome, empresa e e-mail são escapados antes de entrar no HTML.
- Acima de 720px a nota e o mapa dividem a mesma linha; abaixo disso empilham.
