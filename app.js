/* =============================================================
   Oxford Soluções Digitais — Mapa de Performance Digital
   Sem dependências, sem build. Edite os textos direto aqui.
   ============================================================= */

/* ----------------------------------------------------------------
   1. CONFIGURAÇÃO — o que você provavelmente vai querer mudar
   ---------------------------------------------------------------- */

const CONFIG = {
  // WhatsApp que recebe o lead no CTA final.
  // Formato internacional, só dígitos: 55 + DDD + número.
  whatsapp: "5511999999999",

  // Endpoint que registra o lead. Deixe como está para usar a função
  // serverless em /api/lead.js. Se falhar, o relatório aparece do mesmo jeito.
  leadEndpoint: "/api/lead",
};

/* ----------------------------------------------------------------
   2. PERGUNTAS
   ---------------------------------------------------------------- */

const AXIS_LABEL = {
  atracao: "Atração",
  conversao: "Conversão",
  retencao: "Retenção",
  operacao: "Operação",
};

// Peso de cada eixo na nota geral. Atração e conversão pesam mais porque
// é onde o dinheiro entra — e onde a Oxford atua primeiro.
const AXIS_WEIGHT = {
  atracao: 0.3,
  conversao: 0.3,
  retencao: 0.2,
  operacao: 0.2,
};

// Desempate quando dois eixos empatam na nota mais baixa. Conversão vem
// antes de atração de propósito: não adianta colocar mais gente no topo
// de um funil que vaza.
const BOTTLENECK_PRIORITY = ["conversao", "atracao", "retencao", "operacao"];

const QUESTIONS = [
  {
    id: "origem-clientes",
    axis: "atracao",
    eyebrow: "Atração",
    text: "Hoje, a maioria dos seus clientes vem de onde?",
    options: [
      { label: "Anúncios pagos, de forma previsível", score: 85 },
      { label: "Indicação e redes sociais no orgânico", score: 45 },
      { label: "Não sei dizer ao certo de onde vêm", score: 15 },
    ],
  },
  {
    id: "taxa-fechamento",
    axis: "conversao",
    eyebrow: "Conversão",
    text: "Das pessoas que te procuram ou demonstram interesse, quantas realmente fecham?",
    options: [
      { label: "A maioria", score: 85 },
      { label: "Cerca de metade", score: 50 },
      { label: "Poucas, ou não sei dizer", score: 20 },
    ],
  },
  {
    id: "recompra",
    axis: "retencao",
    eyebrow: "Retenção",
    text: "Seus clientes costumam comprar ou contratar de novo?",
    options: [
      { label: "Sim, com frequência", score: 90 },
      { label: "Às vezes", score: 50 },
      { label: "Quase nunca, é sempre gente nova", score: 15 },
    ],
  },
  {
    id: "pos-venda",
    axis: "retencao",
    eyebrow: "Retenção",
    text: "Depois da venda, você faz algo para manter contato com o cliente?",
    options: [
      { label: "Sim, de forma ativa", score: 90 },
      { label: "De vez em quando", score: 45 },
      { label: "Não faço nada", score: 10 },
    ],
  },
  {
    id: "responsavel",
    axis: "operacao",
    eyebrow: "Operação",
    text: "Quem cuida do marketing e das vendas do seu negócio hoje?",
    options: [
      { label: "Tenho equipe ou agência especializada cuidando", score: 85 },
      { label: "Eu mesmo, no improviso", score: 40 },
      { label: "Ninguém cuida, simplesmente acontece", score: 10 },
    ],
  },
  {
    id: "satisfacao",
    eyebrow: "Diagnóstico",
    text: "Com tudo que você respondeu até aqui, o quão satisfeito você está com o marketing e as vendas do seu negócio?",
    options: [
      { label: "Satisfeito, está indo bem", lead: 0 },
      { label: "Mais ou menos", lead: 1 },
      { label: "Insatisfeito, sei que pode ser muito melhor", lead: 2 },
    ],
  },
  {
    id: "investimento-atual",
    eyebrow: "Seu contexto",
    text: "Quanto você investe hoje em marketing e anúncios por mês?",
    options: [
      { label: "Não invisto nada" },
      { label: "Até R$ 1 mil" },
      { label: "R$ 1 mil a R$ 3 mil" },
      { label: "R$ 3 mil a R$ 10 mil" },
      { label: "Acima de R$ 10 mil" },
    ],
  },
  {
    id: "urgencia",
    eyebrow: "Seu contexto",
    text: "Qual sua urgência em ter uma equipe especializada — que já gerenciou mais de R$ 3 milhões em tráfego — cuidando disso para você?",
    options: [
      { label: "Quero começar agora", lead: 2 },
      { label: "Nos próximos meses", lead: 1 },
      { label: "Só pesquisando por enquanto", lead: 0 },
    ],
  },
  {
    id: "tipo-negocio",
    eyebrow: "Seu contexto",
    text: "Que tipo de negócio você tem?",
    options: [
      { label: "Loja online (e-commerce)" },
      { label: "Prestador de serviço" },
      { label: "Infoproduto ou curso" },
      { label: "B2B" },
      { label: "Outro" },
    ],
  },
  {
    id: "faturamento",
    eyebrow: "Seu contexto",
    text: "Qual o faturamento médio mensal do seu negócio?",
    options: [
      { label: "Até R$ 10 mil" },
      { label: "R$ 10 mil a R$ 50 mil" },
      { label: "R$ 50 mil a R$ 100 mil" },
      { label: "R$ 100 mil a R$ 300 mil" },
      { label: "Acima de R$ 300 mil" },
    ],
  },
  {
    id: "disposicao-investir",
    eyebrow: "Seu contexto",
    text: "Você está disposto a investir de R$ 3.000 a R$ 5.000 a mais no crescimento da sua empresa?",
    options: [
      { label: "Sim", lead: 2 },
      { label: "Não", lead: 0 },
    ],
  },
];

/* ----------------------------------------------------------------
   3. TEXTOS DO DIAGNÓSTICO
   ---------------------------------------------------------------- */

const BAND_LABEL = { critico: "Crítico", atencao: "Atenção", bom: "Saudável" };

// Leitura curta de cada eixo, por faixa de nota.
const AXIS_VERDICT = {
  atracao: {
    critico:
      "Você não sabe de onde vêm seus clientes. Sem isso não dá para repetir o que deu certo nem cortar o que deu errado — cada mês recomeça do zero.",
    atencao:
      "Sua aquisição depende de indicação e alcance orgânico. Funciona, mas não tem acelerador: você não decide quantos clientes chegam no mês que vem.",
    bom: "Você tem uma fonte previsível de clientes. O próximo passo é escala — aumentar volume sem estourar o custo de aquisição.",
  },
  conversao: {
    critico:
      "Muita gente demonstra interesse e pouca gente fecha. Todo real investido em atrair cliente está vazando antes da venda acontecer.",
    atencao:
      "Metade das oportunidades se perde no caminho. Corrigir isso aumenta o faturamento sem aumentar um centavo de investimento em mídia.",
    bom: "Seu processo comercial converte bem. É isso que permite investir mais em atração com segurança.",
  },
  retencao: {
    critico:
      "Seu negócio vive de cliente novo. É o modelo mais caro que existe: você paga todo mês para adquirir a receita que já poderia ter na base.",
    atencao:
      "Existe recompra, mas por acaso, não por processo. Um fluxo estruturado de pós-venda transforma isso em receita previsível.",
    bom: "Sua base compra de novo. Esse é o ativo mais valioso do negócio e o que mais aumenta o quanto você pode pagar por um cliente novo.",
  },
  operacao: {
    critico:
      "Ninguém é responsável pelo marketing do seu negócio. Sem dono não existe meta, não existe correção de rota e não existe resultado acumulado.",
    atencao:
      "Você é o gargalo da sua própria operação. Enquanto marketing depender do seu tempo, vai ser sempre a primeira coisa a parar quando a semana aperta.",
    bom: "Existe estrutura cuidando da operação. O foco agora é cobrança de meta e previsibilidade, não execução.",
  },
};

// Diagnóstico aprofundado do gargalo principal — o gancho para a sessão.
const BOTTLENECK_DIAGNOSIS = {
  atracao: {
    headline: "Você não tem uma máquina de aquisição — tem sorte.",
    body: [
      "Quando o cliente chega por indicação ou por um post que funcionou, você não controla o volume. Um mês bom não te ensina nada sobre o próximo, porque não existe alavanca para puxar e repetir o resultado.",
      "Negócio que cresce tem uma origem de cliente que responde a investimento: entra R$ 1, sai um número previsível do outro lado. Sem isso, qualquer meta de faturamento é chute — e contratar, estocar ou expandir vira aposta.",
    ],
    risk: "Enquanto a aquisição não for previsível, seu faturamento continua sendo decidido por fatores que você não controla.",
  },
  conversao: {
    headline: "Você está pagando para atrair gente que não compra.",
    body: [
      "Perder a maior parte das oportunidades no meio do caminho é o vazamento mais caro que existe — o custo de atrair aquela pessoa já foi pago. Cada interessado que não fecha é dinheiro que saiu e não voltou.",
      "É também o gargalo que dá retorno mais rápido: sair de 20% para 40% de conversão dobra o faturamento sem aumentar um centavo em mídia. E na prática o problema quase nunca é o produto — é tempo de resposta, oferta mal apresentada ou um processo comercial que não existe no papel.",
    ],
    risk: "Aumentar o investimento em anúncios agora só faria você perder dinheiro mais rápido. O funil precisa parar de vazar primeiro.",
  },
  retencao: {
    headline: "Seu negócio vive de cliente novo — o modelo mais caro que existe.",
    body: [
      "Se quase todo o faturamento vem de quem nunca comprou antes, você recomeça do zero todo mês. A conta de aquisição não para de subir e a margem nunca sobra.",
      "Cliente que já comprou é o mais barato de vender de novo: já confia, já conhece, já pagou uma vez. Um fluxo simples de pós-venda costuma recuperar receita que já está na sua base — sem custo de mídia nenhum.",
    ],
    risk: "Sem recompra você fica preso a um teto: só cresce enquanto investir mais, e para no dia em que o investimento parar.",
  },
  operacao: {
    headline:
      "Marketing sem dono não tem meta, não tem correção de rota e não tem resultado.",
    body: [
      "Quando o marketing é feito no improviso, entre uma tarefa e outra, ele vira a primeira coisa a parar quando a semana aperta. A operação anda em ciclos — um mês de esforço, dois de silêncio — e o resultado nunca acumula.",
      "Não é falta de esforço, é falta de estrutura. Operação de marketing que funciona tem responsável, meta, número acompanhado toda semana e decisão tomada com dado, não com sensação.",
    ],
    risk: "Enquanto isso depender da sua energia, marketing vai ser sempre a área mais frágil do seu negócio.",
  },
};

const OVERALL_VERDICT = {
  critico: {
    title: "Operação no improviso",
    summary:
      "Seu crescimento hoje depende de fatores que você não controla. Existe negócio funcionando, mas não existe máquina — e isso coloca um teto duro em qualquer meta que você tente bater.",
  },
  atencao: {
    title: "Estrutura frágil",
    summary:
      "Algumas partes do seu funil funcionam, outras vazam. É o cenário mais comum e também o mais caro: você já investe esforço e dinheiro, mas perde resultado em pontos específicos que dá para corrigir.",
  },
  bom: {
    title: "Operação estruturada",
    summary:
      "Seu funil tem base sólida. O jogo aqui não é mais consertar — é escalar sem quebrar o que já funciona e proteger a margem enquanto o volume cresce.",
  },
};

/* ----------------------------------------------------------------
   4. PONTUAÇÃO
   ---------------------------------------------------------------- */

function bandOf(score) {
  if (score < 40) return "critico";
  if (score < 65) return "atencao";
  return "bom";
}

function computeResult(answers) {
  const buckets = { atracao: [], conversao: [], retencao: [], operacao: [] };
  let leadScore = 0;

  for (const question of QUESTIONS) {
    const option = question.options[answers[question.id]];
    if (!option) continue;
    if (question.axis && option.score !== undefined) {
      buckets[question.axis].push(option.score);
    }
    if (option.lead !== undefined) leadScore += option.lead;
  }

  const axes = Object.keys(AXIS_LABEL).map((axis) => {
    const values = buckets[axis];
    const score = values.length
      ? Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
      : 0;
    return { axis, label: AXIS_LABEL[axis], score, band: bandOf(score) };
  });

  const overall = Math.round(
    axes.reduce((sum, a) => sum + a.score * AXIS_WEIGHT[a.axis], 0)
  );

  const byPriority = BOTTLENECK_PRIORITY.map((axis) =>
    axes.find((a) => a.axis === axis)
  );
  const lowest = Math.min(...axes.map((a) => a.score));
  const highest = Math.max(...axes.map((a) => a.score));

  return {
    overall,
    overallBand: bandOf(overall),
    axes,
    bottleneck: byPriority.find((a) => a.score === lowest),
    strength: byPriority.find((a) => a.score === highest),
    leadScore,
    leadTemp: leadScore >= 5 ? "quente" : leadScore >= 3 ? "morno" : "frio",
  };
}

/* ----------------------------------------------------------------
   5. UTILITÁRIOS
   ---------------------------------------------------------------- */

const app = document.getElementById("app");
const landing = document.getElementById("landing");

/** Escapa texto do usuário antes de injetar no HTML. */
function esc(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}

/**
 * Empurra um evento para o dataLayer do Google Tag Manager.
 *
 * Funciona com a tag desligada: o dataLayer é só um array, então o push
 * acontece de qualquer jeito e o GTM consome o histórico inteiro quando
 * (e se) carregar. Nunca mande nome, e-mail ou telefone por aqui — o GA4
 * proíbe dado pessoal e a conta pode ser suspensa por isso.
 */
function track(event, data) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}

/** Texto da alternativa escolhida numa pergunta, pelo id dela. */
function answerLabel(questionId) {
  const question = QUESTIONS.find((q) => q.id === questionId);
  return question?.options[state.answers[questionId]]?.label ?? "—";
}

function render(html) {
  landing.hidden = true;
  app.hidden = false;
  app.innerHTML = html;
  window.scrollTo({ top: 0 });
}

const TOTAL_STEPS = QUESTIONS.length + 1; // perguntas + formulário de contato

function progressBar(step, eyebrow) {
  return `
    <div class="progress">
      <div class="shell">
        <div class="progress__track">
          <div class="progress__fill" style="width:${(step / TOTAL_STEPS) * 100}%"></div>
        </div>
        <div class="progress__label">
          <span class="eyebrow">${esc(eyebrow)}</span>
          <span class="eyebrow">${step + 1} / ${TOTAL_STEPS}</span>
        </div>
      </div>
    </div>`;
}

/* ----------------------------------------------------------------
   6. ESTADO E TELAS
   ---------------------------------------------------------------- */

const state = { index: 0, answers: {}, contact: null, result: null };

const KEYS = ["A", "B", "C", "D", "E"];

function showQuestion() {
  const q = QUESTIONS[state.index];

  render(`
    <main class="quiz">
      ${progressBar(state.index, q.eyebrow)}
      <div class="shell quiz__body">
        <div class="fade">
          <h2 class="quiz__question">${esc(q.text)}</h2>
          <div class="options">
            ${q.options
              .map(
                (option, i) => `
              <button class="option" data-index="${i}"
                data-selected="${state.answers[q.id] === i}">
                <span class="option__key" aria-hidden="true">${KEYS[i]}</span>
                ${esc(option.label)}
              </button>`
              )
              .join("")}
          </div>
          ${
            state.index > 0
              ? `<div class="quiz__back">
                   <button class="btn btn--ghost" id="back">← Voltar</button>
                 </div>`
              : ""
          }
        </div>
      </div>
    </main>`);

  app.querySelectorAll(".option").forEach((button) => {
    button.addEventListener("click", () => {
      state.answers[q.id] = Number(button.dataset.index);
      if (state.index === QUESTIONS.length - 1) showContact();
      else {
        state.index += 1;
        showQuestion();
      }
    });
  });

  const back = app.querySelector("#back");
  if (back) {
    back.addEventListener("click", () => {
      state.index -= 1;
      showQuestion();
    });
  }
}

const FIELDS = [
  { key: "nome", label: "Seu nome", placeholder: "Como podemos te chamar", type: "text", autocomplete: "name" },
  { key: "empresa", label: "Nome da empresa", placeholder: "Sua empresa", type: "text", autocomplete: "organization" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "(00) 00000-0000", type: "tel", autocomplete: "tel", inputmode: "tel" },
  { key: "email", label: "E-mail", placeholder: "voce@empresa.com.br", type: "email", autocomplete: "email", inputmode: "email" },
];

function validate(contact) {
  const errors = {};
  if (contact.nome.trim().length < 2) errors.nome = "Informe seu nome.";
  if (contact.empresa.trim().length < 2) errors.empresa = "Informe o nome da empresa.";
  if (contact.whatsapp.replace(/\D/g, "").length < 10)
    errors.whatsapp = "Informe um WhatsApp válido com DDD.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact.email.trim()))
    errors.email = "Informe um e-mail válido.";
  return errors;
}

/** (11) 98888-7777 conforme digita. Celular quebra em 5+4, fixo em 4+4. */
function maskPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  const split = digits.length > 10 ? 5 : 4;
  if (rest.length <= split) return `(${ddd}) ${rest}`;
  return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`;
}

function showContact() {
  render(`
    <main class="quiz">
      ${progressBar(QUESTIONS.length, "Último passo")}
      <div class="shell quiz__body">
        <div class="fade">
          <h2 class="quiz__question">Seu mapa está pronto. Falta só saber quem é você.</h2>
          <form class="form" id="contact-form" novalidate>
            ${FIELDS.map(
              (f) => `
              <div class="field">
                <label for="${f.key}">${f.label}</label>
                <input id="${f.key}" name="${f.key}" type="${f.type}"
                  placeholder="${f.placeholder}" autocomplete="${f.autocomplete}"
                  ${f.inputmode ? `inputmode="${f.inputmode}"` : ""} />
                <p class="field__error" id="${f.key}-error" hidden></p>
              </div>`
            ).join("")}
            <button class="btn form__submit" type="submit">Ver meu mapa de performance</button>
            <p class="form__privacy">
              Seus dados ficam com a Oxford. Sem spam, sem lista de terceiros.
            </p>
          </form>
          <div class="quiz__back">
            <button class="btn btn--ghost" id="back" type="button">← Voltar</button>
          </div>
        </div>
      </div>
    </main>`);

  const phone = app.querySelector("#whatsapp");
  phone.addEventListener("input", () => {
    phone.value = maskPhone(phone.value);
  });

  app.querySelector("#back").addEventListener("click", () => {
    state.index = QUESTIONS.length - 1;
    showQuestion();
  });

  app.querySelector("#contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const contact = Object.fromEntries(
      FIELDS.map((f) => [f.key, app.querySelector(`#${f.key}`).value])
    );
    const errors = validate(contact);

    for (const f of FIELDS) {
      const input = app.querySelector(`#${f.key}`);
      const error = app.querySelector(`#${f.key}-error`);
      if (errors[f.key]) {
        input.setAttribute("aria-invalid", "true");
        error.textContent = errors[f.key];
        error.hidden = false;
      } else {
        input.removeAttribute("aria-invalid");
        error.hidden = true;
      }
    }

    if (Object.keys(errors).length) {
      app.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    state.contact = contact;
    state.result = computeResult(state.answers);

    // Conversão da isca. Só dado de qualificação — nada que identifique
    // a pessoa, que é o que o GA4 não aceita.
    track("isca_conclusao", {
      nota_geral: state.result.overall,
      classificacao: state.result.overallBand,
      gargalo: state.result.bottleneck.label,
      temperatura: state.result.leadTemp,
      lead_score: state.result.leadScore,
      tipo_negocio: answerLabel("tipo-negocio"),
      faturamento: answerLabel("faturamento"),
      investimento_atual: answerLabel("investimento-atual"),
      disposicao_investir: answerLabel("disposicao-investir"),
    });

    sendLead();
    showCalculating();
  });
}

const CALC_STEPS = [
  "Cruzando suas respostas...",
  "Calculando a nota de cada eixo...",
  "Identificando seu gargalo principal...",
  "Montando seu mapa...",
];

function showCalculating() {
  render(`
    <main class="calc">
      <div>
        <div class="calc__dot"></div>
        <p class="calc__step fade" id="calc-step" aria-live="polite">${CALC_STEPS[0]}</p>
      </div>
    </main>`);

  const node = app.querySelector("#calc-step");
  let step = 0;

  const timer = setInterval(() => {
    step += 1;
    if (step >= CALC_STEPS.length) {
      clearInterval(timer);
      showReport();
      return;
    }
    node.textContent = CALC_STEPS[step];
    node.classList.remove("fade");
    void node.offsetWidth; // reinicia a animação de entrada
    node.classList.add("fade");
  }, 650);
}

/* ----------------------------------------------------------------
   6b. GRÁFICOS — SVG gerado na mão, sem biblioteca
   ---------------------------------------------------------------- */

/** Nota de referência de uma operação saudável. Usada pelos três gráficos. */
const BENCHMARK = 75;

/**
 * Medidor em arco graduado para a nota geral. Traz escala de 10 em 10,
 * as fronteiras das faixas (40 e 65) e a marca da operação saudável (75),
 * para o número ser lido contra uma régua e não sozinho.
 */
function gaugeSvg(score) {
  const R = 86;
  const CX = 134;
  const CY = 124;
  const ARC = Math.PI * R;
  const TRACK = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;

  // Converte um valor 0–100 numa coordenada sobre o arco.
  const at = (value, radius) => {
    const angle = Math.PI * (1 - value / 100);
    return [CX + radius * Math.cos(angle), CY - radius * Math.sin(angle)];
  };

  const radial = (value, from, to, className) => {
    const [x1, y1] = at(value, from);
    const [x2, y2] = at(value, to);
    return `<line class="${className}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}"
      x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" />`;
  };

  // Escala: traço curto a cada 10, traço longo a cada 50.
  let ticks = "";
  for (let value = 0; value <= 100; value += 10) {
    const major = value % 50 === 0;
    ticks += radial(value, R + 5, R + (major ? 14 : 10), "gauge__grad");
  }

  // Marca da referência saudável.
  const [bx, by] = at(BENCHMARK, R + 21);
  const benchmark =
    radial(BENCHMARK, R - 11, R + 15, "gauge__benchmark") +
    `<text class="gauge__benchmark-label" x="${bx.toFixed(1)}" y="${by.toFixed(1)}"
      text-anchor="middle">saudável</text>`;

  const [minX, minY] = at(0, R + 23);
  const [maxX, maxY] = at(100, R + 23);

  return `
    <svg class="gauge" viewBox="0 0 268 152" role="img"
      aria-label="Nota geral: ${score} de 100. Faixas: até 39 crítico, 40 a 64 atenção, 65 ou mais saudável. Referência de operação saudável: ${BENCHMARK}.">
      <path class="gauge__track" d="${TRACK}" />
      ${ticks}
      <path class="gauge__fill" d="${TRACK}"
        stroke-dasharray="${((score / 100) * ARC).toFixed(1)} ${ARC.toFixed(1)}" />
      ${benchmark}
      <text class="gauge__scale" x="${minX.toFixed(1)}" y="${minY.toFixed(1)}"
        text-anchor="middle">0</text>
      <text class="gauge__scale" x="${maxX.toFixed(1)}" y="${maxY.toFixed(1)}"
        text-anchor="middle">100</text>
    </svg>`;
}


const RADAR_ORDER = ["atracao", "conversao", "retencao", "operacao"];

/**
 * Radar dos 4 eixos. Duas formas sobrepostas: a do negócio e a de uma
 * operação saudável. O buraco entre elas é o argumento da isca.
 */
function radarSvg(axes, bottleneckAxis) {
  const CX = 160;
  const CY = 130;
  const R = 96;

  const point = (index, value) => {
    const angle = ((-90 + index * 90) * Math.PI) / 180;
    const radius = (R * value) / 100;
    return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)];
  };

  const polygon = (values) =>
    values.map((v, i) => point(i, v).map((n) => n.toFixed(1)).join(",")).join(" ");

  const ordered = RADAR_ORDER.map((axis) => axes.find((a) => a.axis === axis));
  const scores = ordered.map((a) => a.score);

  // Anéis de referência a cada 25 pontos.
  const rings = [25, 50, 75, 100]
    .map(
      (value) =>
        `<polygon class="radar__ring" points="${polygon([value, value, value, value])}" />`
    )
    .join("");

  const spokes = ordered
    .map((_, i) => {
      const [x, y] = point(i, 100);
      return `<line class="radar__spoke" x1="${CX}" y1="${CY}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" />`;
    })
    .join("");

  const vertices = ordered
    .map((axis, i) => {
      const [x, y] = point(i, axis.score);
      const accent = axis.axis === bottleneckAxis;
      return `<circle class="radar__dot" data-accent="${accent}" r="${accent ? 6 : 4.5}"
        cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" />`;
    })
    .join("");

  // Só o nome do eixo — a nota exata fica nas barras logo abaixo.
  // Os rótulos laterais ancoram nas bordas do viewBox para nunca cortarem.
  const LABEL = [
    { x: CX, y: 22, anchor: "middle" },
    { x: 318, y: CY + 4, anchor: "end" },
    { x: CX, y: 246, anchor: "middle" },
    { x: 2, y: CY + 4, anchor: "start" },
  ];

  const labels = ordered
    .map((axis, i) => {
      const spot = LABEL[i];
      return `<text class="radar__label" data-accent="${axis.axis === bottleneckAxis}"
        x="${spot.x}" y="${spot.y}" text-anchor="${spot.anchor}">${axis.label}</text>`;
    })
    .join("");

  return `
    <svg class="radar" viewBox="0 0 320 258" role="img"
      aria-label="Formato do funil: ${ordered
        .map((a) => `${a.label} ${a.score}`)
        .join(", ")}. Referência de operação saudável: ${BENCHMARK} em todos os eixos.">
      ${rings}${spokes}
      <polygon class="radar__benchmark"
        points="${polygon([BENCHMARK, BENCHMARK, BENCHMARK, BENCHMARK])}" />
      <g class="radar__plot" style="transform-origin:${CX}px ${CY}px">
        <polygon class="radar__shape" points="${polygon(scores)}" />
        ${vertices}
      </g>
      ${labels}
    </svg>`;
}

/**
 * Quanto cada eixo devolve na nota geral se for levado até o nível de uma
 * operação saudável: peso do eixo × distância até a referência.
 *
 * O eixo com a menor nota nem sempre é o de maior retorno — um eixo de peso
 * alto um pouco abaixo do saudável pode valer mais do que um eixo de peso
 * baixo lá no fundo. É isso que define a ordem de ataque.
 */
function computeImpact(result) {
  return result.axes
    .map((axis) => {
      const gap = Math.max(0, BENCHMARK - axis.score);
      return { ...axis, gap, impact: AXIS_WEIGHT[axis.axis] * gap };
    })
    .sort((a, b) => b.impact - a.impact);
}

const pts = (value) => value.toFixed(1).replace(".", ",");

/** Barras de impacto, escaladas pelo maior retorno da lista. */
function impactChart(ranked) {
  const top = ranked[0].impact || 1;

  return `
    <div class="chart chart--impact">
      ${ranked
        .map((axis, i) => {
          // Eixo já no nível saudável não tem o que recuperar: sem posição,
          // sem barra, sem número inventado.
          if (axis.impact <= 0) {
            return `
        <div class="bar" data-done="true">
          <span class="bar__name"><span class="bar__rank">✓</span>${axis.label}</span>
          <span class="bar__track"></span>
          <span class="bar__value"><small>no nível</small></span>
        </div>`;
          }
          return `
        <div class="bar">
          <span class="bar__name">
            <span class="bar__rank">${i + 1}</span>${axis.label}
          </span>
          <span class="bar__track" role="img"
            aria-label="${axis.label}: recupera ${pts(axis.impact)} pontos da nota geral">
            <span class="bar__fill" data-accent="${i === 0}"
              style="width:${((axis.impact / top) * 100).toFixed(1)}%"></span>
          </span>
          <span class="bar__value">+${pts(axis.impact)} <small>pts</small></span>
        </div>`;
        })
        .join("")}
    </div>`;
}

/** Barra empilhada: nota de hoje + o que o primeiro item da lista devolve. */
function projectionChart(overall, gain) {
  const projected = Math.round(overall + gain);

  return `
    <div class="projection">
      <div class="projection__bar" role="img"
        aria-label="Nota hoje ${overall}, projetada ${projected} de 100">
        <span class="projection__now" style="width:${overall}%"></span>
        <span class="projection__gain" style="width:${gain}%"></span>
      </div>
      <div class="projection__legend">
        <span><b>${overall}</b> hoje</span>
        <span class="projection__arrow" aria-hidden="true">→</span>
        <span class="projection__target"><b>${projected}</b> corrigindo o primeiro item</span>
      </div>
    </div>`;
}

function whatsappLink(contact, result) {
  const message = [
    `Olá! Sou ${contact.nome}, da ${contact.empresa}.`,
    `Acabei de fazer o Mapa de Performance Digital e tirei ${result.overall}/100.`,
    `Meu principal gargalo é ${result.bottleneck.label}.`,
    `Quero agendar a sessão estratégica.`,
  ].join(" ");
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}

function showReport() {
  const { contact, result } = state;
  const overall = OVERALL_VERDICT[result.overallBand];
  const diagnosis = BOTTLENECK_DIAGNOSIS[result.bottleneck.axis];
  const showStrength = result.strength.axis !== result.bottleneck.axis;
  const ranked = computeImpact(result);
  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  render(`
    <main class="report">
      <header class="report__head">
        <div class="shell">
          <div class="wordmark">Oxford<span>Soluções Digitais</span></div>
          <h1 class="report__title">Mapa de Performance Digital</h1>
          <p class="report__for">Preparado para ${esc(contact.empresa)} — ${today}</p>
        </div>
      </header>

      <div class="shell">
        <div class="report__grid">
          <section class="card score fade">
            <p class="eyebrow">Nota geral do seu funil</p>
            <div class="score__gauge">
              ${gaugeSvg(result.overall)}
              <div class="score__readout">
                <span class="score__value">${result.overall}<sub>/100</sub></span>
              </div>
            </div>
            <p class="score__band">${overall.title}</p>
            <p class="score__summary">${overall.summary}</p>
          </section>

          <section class="section">
            <div class="card">
              <p class="eyebrow">O mapa do seu funil</p>
              ${radarSvg(result.axes, result.bottleneck.axis)}
              <div class="chart">
                ${result.axes
                  .map((axis) => {
                    const isBottleneck = axis.axis === result.bottleneck.axis;
                    return `
                  <div class="bar">
                    <span class="bar__name">${axis.label}</span>
                    <span class="bar__track" role="img"
                      aria-label="${axis.label}: ${axis.score} de 100, ${BAND_LABEL[axis.band]}">
                      <span class="bar__fill" data-accent="${isBottleneck}"
                        style="width:${axis.score}%"></span>
                    </span>
                    <span class="bar__value">${axis.score} <small>${
                      BAND_LABEL[axis.band]
                    }</small></span>
                  </div>`;
                  })
                  .join("")}
              </div>
              <div class="chart__legend">
                <span><i data-accent="true"></i> Gargalo</span>
                <span><i></i> Demais eixos</span>
                <span><i data-ref="true"></i> Operação saudável (${BENCHMARK})</span>
              </div>
            </div>
          </section>
        </div>

        <section class="section">
          <p class="eyebrow">Diagnóstico</p>
          <h2 class="section__title">
            Seu principal gargalo é ${result.bottleneck.label.toLowerCase()}
          </h2>
          <div class="card gargalo">
            <p class="eyebrow eyebrow--accent">
              ${result.bottleneck.label} — ${result.bottleneck.score}/100
            </p>
            <h3 class="gargalo__headline">${diagnosis.headline}</h3>
            ${diagnosis.body.map((p) => `<p>${p}</p>`).join("")}
            <strong class="gargalo__risk">${diagnosis.risk}</strong>
          </div>
        </section>

        <section class="section">
          <p class="eyebrow">Plano</p>
          <h2 class="section__title">Por onde começar</h2>
          <div class="card">
            <p class="plan__intro">
              Quanto cada eixo devolve na sua nota geral se for levado até o
              nível de uma operação saudável. A ordem já é a ordem de ataque.
            </p>
            ${impactChart(ranked)}
            ${projectionChart(result.overall, ranked[0].impact)}
            ${
              showStrength
                ? `<p class="plan__strength">
                     <b>${result.strength.label} (${result.strength.score}) é seu ponto mais
                     forte hoje.</b>
                     ${AXIS_VERDICT[result.strength.axis][result.strength.band]}
                   </p>`
                : ""
            }
          </div>
        </section>

        <section class="section">
          <div class="cta">
            <p class="eyebrow eyebrow--on-blue">Próximo passo</p>
            <h2>Vamos resolver seu gargalo de ${result.bottleneck.label.toLowerCase()}?</h2>
            <p>
              O mapa mostra onde está o problema. A sessão estratégica mostra como
              resolver — com a equipe que já gerenciou mais de R$ 3 milhões em tráfego.
            </p>
            <ul class="cta__list">
              <li>45 minutos, direto ao ponto, sem enrolação</li>
              <li>Plano de ação específico para o seu gargalo</li>
              <li>Projeção de quanto você deixa na mesa hoje</li>
              <li>Sem custo e sem compromisso de contratar</li>
            </ul>
            <a class="btn" id="whatsapp" href="${whatsappLink(contact, result)}"
              target="_blank" rel="noopener noreferrer">
              Agendar minha sessão estratégica
            </a>
          </div>
        </section>
      </div>
    </main>`);

  // O link abre em outra aba, então não há corrida com o unload: o push
  // acontece e a página continua viva para o GTM despachar a tag.
  app.querySelector("#whatsapp").addEventListener("click", () => {
    track("isca_whatsapp", {
      gargalo: result.bottleneck.label,
      nota_geral: result.overall,
      temperatura: result.leadTemp,
    });
  });
}

/* ----------------------------------------------------------------
   7. ENVIO DO LEAD
   ---------------------------------------------------------------- */

function sendLead() {
  // Sem endpoint configurado não há o que enviar.
  if (!CONFIG.leadEndpoint) return;

  const { contact, answers, result } = state;

  const payload = {
    ...contact,
    submittedAt: new Date().toISOString(),
    notaGeral: result.overall,
    classificacao: result.overallBand,
    gargalo: result.bottleneck.label,
    notaGargalo: result.bottleneck.score,
    pontoForte: result.strength.label,
    notasPorEixo: Object.fromEntries(result.axes.map((a) => [a.label, a.score])),
    temperatura: result.leadTemp,
    leadScore: result.leadScore,
    respostas: Object.fromEntries(
      QUESTIONS.map((q) => [q.id, q.options[answers[q.id]]?.label ?? "—"])
    ),
  };

  // Não bloqueia o relatório: se o envio falhar, o usuário nem percebe.
  fetch(CONFIG.leadEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

/* ----------------------------------------------------------------
   8. INÍCIO
   ---------------------------------------------------------------- */

document.getElementById("question-count").textContent = QUESTIONS.length;
document.getElementById("start").addEventListener("click", () => {
  track("isca_inicio", { total_perguntas: QUESTIONS.length });
  showQuestion();
});
