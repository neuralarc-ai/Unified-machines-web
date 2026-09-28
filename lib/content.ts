export const MORSE_URL = "https://onmorse.com"
export const FR_URL = "https://f-r.co"

export const navLinks = [
  { href: "#thinking", label: "Our thinking" },
  { href: "#principles", label: "How we build" },
  { href: "#process", label: "Enterprises" },
  { href: "#products", label: "Products" },
  { href: "#partner", label: "Partner" },
] as const

export type SymbolKey = "human" | "machine" | "heart"

/** UM.OS: a meeting and its follow-through, the job Morse is being built for. */
export const desk = {
  label: "UM.OS",
  readme: {
    file: "readme.txt",
    title: "One job, done whole.",
    text: "This desktop is a meeting and everything around it, the job Morse is being built for. Press a symbol to read what it stands for.",
  },
  call: {
    file: "morse · Weekly sync",
    task: "Weekly sync",
    rec: "REC",
    people: [
      { initials: "PS", avatar: "/avatars/ember.webp" },
      { initials: "JM", avatar: "/avatars/fjord.webp" },
      { initials: "DK", avatar: "/avatars/lagoon.webp" },
    ],
    who: "Priya",
    said: "Can we get the launch brief ready for Friday?",
  },
  notes: {
    file: "notes.md",
    heading: "Action items",
    items: ["Share Q3 numbers · Dan · Wed"],
    added: "Launch brief · Jamie · Fri",
  },
  cal: { file: "calendar", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], standup: "Standup", booked: "Follow-up", time: "14:00" },
  clock: "clock",
  icons: [
    {
      key: "human",
      label: "human.sym",
      title: "Human ambition.",
      text: "Every product starts with a real need: the person on the other side of the screen, with a Tuesday to get through.",
    },
    {
      key: "machine",
      label: "machine.sym",
      title: "Machine intelligence.",
      text: "Intelligence in the foundation, doing the heavy lifting: here, writing the notes and booking the follow-up.",
    },
    {
      key: "heart",
      label: "heart.sym",
      title: "Meaningful progress.",
      text: "What the two make together: a meeting that ends with everyone knowing what happens next.",
    },
  ] satisfies { key: SymbolKey; label: string; title: string; text: string }[],
}

export const equation: { key: SymbolKey; label: string; text: string }[] = [
  {
    key: "human",
    label: "human",
    text: "Human ambition: the need, the taste and the stubborn belief things should be better.",
  },
  {
    key: "machine",
    label: "machine",
    text: "Machine intelligence: models in the foundation, doing the heavy lifting quietly.",
  },
  {
    key: "heart",
    label: "possibility",
    text: "Possibility: the product people are glad to use, and the reason we exist.",
  },
]
export const equationDefault =
  "Start with a real human need. Add intelligence at the foundation. Ship something people are glad to use for years."

export type DiagramMode = "rings" | "grid" | "line" | "squares"

export const principles: {
  key: string
  n: string
  title: string
  body: string
  diagram: { symbol: SymbolKey; file: string; caption: string; code: string; mode: DiagramMode }
}[] = [
  {
    key: "intelligence",
    n: "01",
    title: "Intelligent by nature",
    body: "AI belongs in a product's foundation. We start with what intelligence makes possible, then design the whole experience around it. The result feels less like software with a feature bolted on and more like a tool with a mind of its own.",
    diagram: { symbol: "machine", file: "core.dgm", caption: "Intelligence, from the inside out.", code: "UM / CORE", mode: "rings" },
  },
  {
    key: "useful",
    n: "02",
    title: "Useful before anything",
    body: "We focus on the things people already need. The work they do every day. The friction they have learned to accept. The possibilities hiding in plain sight. We measure an idea by the difference it makes to someone's Tuesday.",
    diagram: { symbol: "human", file: "need.dgm", caption: "Human needs. The starting point.", code: "UM / PURPOSE", mode: "grid" },
  },
  {
    key: "sovereign",
    n: "03",
    title: "As sovereign as possible",
    body: "Progress should bring greater independence. We build toward as much sovereignty as possible, with meaningful choice and control guiding every decision about where your data lives and who gets to see it.",
    diagram: { symbol: "heart", file: "own.dgm", caption: "Progress, on your own terms.", code: "UM / SOVEREIGN", mode: "line" },
  },
  {
    key: "whole",
    n: "04",
    title: "Built to last",
    body: "Models will change. The job will not. We design each product around the job, keep the intelligence swappable underneath, and would rather build one thing well than three things loosely connected.",
    diagram: { symbol: "machine", file: "whole.dgm", caption: "One thing, done whole.", code: "UM / WHOLE", mode: "squares" },
  },
]

export const phases = [
  {
    label: "Research",
    title: "We start inside the work.",
    body: "Before a line of code, we sit with the people who do the job. We map the handoffs, the workarounds and the spreadsheet nobody admits to, and we write down what a good day would look like.",
  },
  {
    label: "Simplify",
    title: "We take things away.",
    body: "Most enterprise software grows by addition. We do the opposite: fewer screens, fewer steps, fewer logins. What remains is the smallest product that covers the whole job, with intelligence handling the parts that never needed a person.",
  },
  {
    label: "Build",
    title: "We ship something that stays.",
    body: "A meaningful solution is one your team reaches for without being told to, this year and the year after. We build it with AI in the foundation, keep it under your control, and design it to outlive the model it launched on.",
  },
]

export const problems = [
  {
    problem: "The meeting that needs a calendar link, a video app and a notetaker bot.",
    outcome: "One place for the conversation and everything around it.",
  },
  {
    problem: "The document that exists in four versions across three tools.",
    outcome: "A single source that stays current on its own.",
  },
  {
    problem: "The report someone rebuilds by hand every Monday.",
    outcome: "Intelligence that assembles it before anyone asks.",
  },
  {
    problem: "The approval that waits in an inbox for two days.",
    outcome: "Routing that knows who decides, and nudges them.",
  },
  {
    problem: "The question only one person in the company can answer.",
    outcome: "A shared memory the whole team can ask.",
  },
]

export const tools = [
  "Video", "Calendar", "Notes", "Chat", "Tasks", "Files",
  "Transcripts", "CRM", "Forms", "Approvals", "Search", "Reports",
]

export const commitments = [
  { title: "Data residency.", body: "Your records live where you decide." },
  { title: "Model choice.", body: "Which intelligence runs is yours to choose, homegrown models included." },
  { title: "Access.", body: "Who sees what is set by your rules, at the level you set them." },
  { title: "Exit.", body: "Take everything with you, any time, in a form you can use." },
  { title: "Audit.", body: "What the machine did and why, always on the record." },
]

/**
 * Morse, in its own words (checked against morse-landing's content): the
 * seven jobs it replaces, and one meeting played through the three things it
 * does in it.
 */
export const morse = {
  meeting: "Weekly product sync",
  startSeconds: 12 * 60 + 4,
  jobs: ["Video call", "Notetaker", "Recordings", "Transcripts", "In-call assistant", "Whiteboard", "Booking link"],
  scenes: [
    {
      id: "notes",
      label: "Notes",
      speaker: "Priya",
      said: "Can we get the launch brief ready for Friday?",
      result: { lead: "Action item", text: "Launch brief · Jamie · Fri" },
    },
    {
      id: "teleprompter",
      label: "Teleprompter",
      speaker: "Daniel",
      said: "What did we agree with Acme on pricing?",
      result: { lead: "From Acme renewal notes", text: "This year’s rate, fixed until March, with two extra seats." },
    },
    {
      id: "follow-up",
      label: "Follow-up",
      speaker: "Priya",
      said: "Let’s pick this up Thursday at two.",
      result: { lead: "Book a follow-up?", text: "Thu, 2:00 – 2:30 pm", done: "Booked. Invites sent." },
    },
  ],
}

export const roadmap = [
  { name: "Morse", status: "Being built", live: true },
  { name: "More products, across other domains", status: "In research", live: false },
]

export const faqs = [
  {
    q: "What does Unified Machines build?",
    a: "AI products for companies, designed to last. Morse, for the calendar and everything around meetings, is the first. More are coming across the different areas and domains a business runs on.",
  },
  {
    q: "What does “built to last” mean for an AI product?",
    a: "The job stays, the model changes. We design each product around the job, keep the intelligence swappable underneath, and work with a model partner we can rely on for years, so the product keeps its value as the technology moves.",
  },
  {
    q: "What is the Fahrenheit Research partnership?",
    a: "Unified Machines is the exclusive partner for Fahrenheit Research’s homegrown, tuned models inside its products. Fahrenheit Research builds small typed decision models that run on device; we tune them to the jobs our products do. Details at f-r.co.",
  },
  {
    q: "Is Morse available today?",
    a: "Morse is being built now. onmorse.com is its home, and public availability will be announced there.",
  },
  {
    q: "What comes after Morse?",
    a: "Products in other domains of business, currently in research. Each one follows the same path: research the day-to-day work, simplify it, build the smallest product that covers the whole job, under your control.",
  },
  {
    q: "What does “sovereign” mean here?",
    a: "As much control as possible over your data, your models and your dependencies. We hold every product to five aims: data residency, model choice, access, exit and audit, and we say plainly where one is not met yet.",
  },
  {
    q: "What do the three symbols mean?",
    a: "The face is human ambition. The cross is machine intelligence. The heart is what happens when the two work as one: meaningful progress. Press them on the desktop above to read more.",
  },
]
