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

**2. CRM da Oxford** (opcional, mas é o caminho principal) — defina
`CRM_API_URL` e `CRM_API_KEY` nas variáveis de ambiente do projeto na Vercel.
Com as duas preenchidas, todo lead é cadastrado no CRM e adicionado à lista
"Leads - Mapa da performance digital". Ver a seção **Integração com o CRM**
mais abaixo.

**3. Destino adicional do lead** (opcional) — defina `LEAD_WEBHOOK_URL` nas
variáveis de ambiente, apontando para n8n, Make, Zapier ou uma planilha. Roda
em paralelo ao CRM, não no lugar dele. Sem nenhuma das duas, o lead ainda
aparece nos logs da Vercel.

O payload enviado (para o CRM e para o webhook):

```json
{
  "nome": "...", "empresa": "...", "whatsapp": "...", "email": "...",
  "notaGeral": 37, "classificacao": "critico",
  "gargalo": "Conversão", "notaGargalo": 20, "pontoForte": "Retenção",
  "notasPorEixo": { "Atração": 45, "Conversão": 20, "Retenção": 48, "Operação": 40 },
  "temperatura": "quente", "leadScore": 6,
  "respostas": { "origem-clientes": "Indicação e redes sociais no orgânico", "...": "..." },
  "respostasTexto": "Hoje, a maioria dos seus clientes vem de onde?\n→ Indicação...",
  "linkResultado": "https://.../?r=eyJuIjoi...",
  "utms": { "utm_source": "meta", "utm_medium": "cpc", "utm_campaign": "lancamento-agosto" }
}
```

**4. Google Tag Manager** (opcional) — em `index.html`, no topo do `<head>`:

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

## UTMs do clique

A isca lê `utm_source`, `utm_medium`, `utm_campaign`, `utm_term` e
`utm_content` da URL de entrada assim que a página carrega — o link do
anúncio precisa trazer esses parâmetros (o próprio gerenciador do Meta e do
Google Ads já monta isso automaticamente se a UTM estiver configurada na
campanha).

Eles vão para dois lugares:

- **`dataLayer`**, como dado solto (sem `event`), logo na primeira linha —
  fica disponível como variável da camada de dados para qualquer tag, em
  qualquer acionador, sem precisar repetir em cada evento.
- **`utms`** no payload do lead (`/api/lead`), junto com o resto dos dados de
  qualificação — assim o CRM sabe qual campanha, conjunto e criativo trouxe
  cada lead, não só que ele veio de tráfego pago.

Ficam guardados em `sessionStorage` (`oxford_utms`) para sobreviver a um
recarregamento de página dentro da mesma aba. Sem UTM na URL, a isca usa o
que já estiver guardado da entrada; nada é escrito se nunca houve UTM.

Não captura `gclid` nem `fbclid` (os IDs de clique do Google e do Meta, para
correspondência de conversão nas próprias plataformas) — são parâmetros
diferentes de UTM. Se precisar deles depois, é o mesmo mecanismo do
`captureUTMs()` em `app.js`, só acrescentando as chaves.

## Integração com o CRM

Com `CRM_API_URL` e `CRM_API_KEY` configuradas (ver **O que configurar**
acima), `api/lead.js` cadastra o lead no [CRM da
Oxford](https://github.com/RenanhvBorges/crm) a cada envio:

1. `POST /api/v1/contacts?upsert=email` — cria o contato ou, se já existir
   um com o mesmo e-mail (a pessoa refez o teste), atualiza os dados sem
   duplicar. Tag `Lead` é somada às que o contato já tiver, nunca substitui.
2. `POST /api/v1/lists/{id}/members` — adiciona o contato à lista **Leads -
   Mapa da performance digital**, já criada no CRM. Para apontar para outra
   lista, defina `CRM_LIST_ID` (o UUID padrão está fixo em `api/lead.js`).

Os campos personalizados do contato que recebem o resultado (grupo **Mapa de
Performance Digital**, já cadastrado no CRM) e os UTMs (grupo **Marketing**,
reaproveitando `source`/`medium`/`campaign`/`term`/`content` que já
existiam):

| Campo no CRM | Vem de |
|---|---|
| `source`, `medium`, `campaign`, `term`, `content` | `utms` |
| `mapa_nota_geral` | `notaGeral` |
| `mapa_classificacao` | `classificacao` (`critico`/`atencao`/`bom`) |
| `mapa_gargalo` | `gargalo` |
| `mapa_nota_gargalo` | `notaGargalo` |
| `mapa_ponto_forte` | `pontoForte` |
| `mapa_temperatura` | `temperatura` (`frio`/`morno`/`quente`) |
| `mapa_lead_score` | `leadScore` |
| `mapa_respostas` | `respostasTexto` — as 11 perguntas e respostas, formatadas |
| `mapa_link_resultado` | `linkResultado` — ver **Link do resultado** abaixo |

Se `CRM_API_URL`/`CRM_API_KEY` não estiverem configuradas, essa etapa é
pulada sem erro. Se o CRM estiver fora do ar ou responder com erro, a falha é
só logada — o relatório do visitante e o webhook (se configurado) seguem
normalmente.

Criar um campo personalizado novo no CRM não é automático: precisa existir
antes em `custom_field_definitions` (entidade `contact`), senão o valor
chega mas fica invisível no formulário do contato. Use a própria tela
`/contacts/fields` do CRM ou a rota `POST /api/v1/custom-fields`.

## Link do resultado

Cada relatório tem uma URL própria (`?r=<código>`) que reabre exatamente
aquele resultado — para usar na call de vendas em vez de ficar catando
print. Ela é gerada no momento do envio e vai automaticamente para
`mapa_link_resultado` no CRM.

Não existe banco nem servidor por trás: nome, empresa e as respostas viajam
codificadas na própria URL (base64url de um JSON), e a isca recalcula o
relatório na hora, no navegador, sempre com o mesmo resultado. Abrir esse
link não conta como uma nova conversão — não reenvia o lead, não dispara
`isca_conclusao` de novo.

Limitação aceita: se as perguntas ou pontuações de `app.js` mudarem depois,
um link antigo pode calcular diferente do que a pessoa realmente respondeu.
Para o uso pretendido — abrir na call, pouco tempo depois do lead ser gerado
— não é um problema; não é pensado como arquivo permanente.

Também dá para imprimir/exportar em PDF por esse mesmo link, pelo atalho do
próprio navegador (Ctrl+P) — o CSS de impressão já esconde o CTA e mantém as
cores.

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
