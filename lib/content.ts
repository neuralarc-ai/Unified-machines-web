export const MORSE_URL = "https://onmorse.com"
export const FR_URL = "https://f-r.co"
export const FRIDAY_URL = "https://www.fridayapp.fun"

export const navLinks = [
  { href: "#thinking", label: "Our thinking" },
  { href: "#principles", label: "How we build" },
  { href: "#consolidate", label: "Our products" },
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
  /** The guided tour in readme.txt: each step opens the windows it talks about. */
  tour: [
    {
      title: "Welcome to UM.OS.",
      text: "Unified Machines builds AI products for the everyday work of companies. This desk is a tour: four steps, about twenty seconds.",
      opens: [],
    },
    {
      title: "Morse, for meetings.",
      text: "One app for the call, the notes and the follow-up. Watch this meeting: the ask becomes an action item, and the follow-up books itself.",
      opens: ["call", "notes", "cal"],
    },
    {
      title: "Friday, for screen recordings.",
      text: "Record your Mac and it polishes itself: every click becomes a smooth zoom, with glass styling and music. It all runs on your Mac.",
      opens: ["friday-app"],
    },
    {
      title: "Now it's your desk.",
      text: "Open files/ to jump around the page, press a symbol to read it, or look in the trash for the tools Morse replaced. Double-click a title bar to fill the desk.",
      opens: ["files"],
    },
  ] as { title: string; text: string; opens: string[] }[],
  /** files/: the page's sections, as folders. */
  files: [
    { name: "thinking/", note: "Why we build", href: "#thinking" },
    { name: "principles/", note: "How we build", href: "#principles" },
    { name: "morse/", note: "Meetings, one app", href: "#consolidate" },
    { name: "friday/", note: "Screen recordings", href: "#friday" },
    { name: "partner/", note: "Fahrenheit Research", href: "#partner" },
    { name: "faq/", note: "Questions, answered", href: "#faq" },
  ],
  /** trash: the meeting tools Morse folds into one app. */
  trash: {
    file: "trash",
    heading: "7 items · replaced by Morse",
    empty: "Emptied. Morse holds all seven now.",
  },
  /** The product icons on the desk. */
  apps: {
    morse: {
      file: "morse.app",
      name: "Morse",
      role: "For meetings",
      text: "The call, the calendar and what everyone needs to remember afterwards, in one app. Being built now.",
    },
    friday: {
      file: "friday.app",
      name: "Friday",
      role: "For screen recordings",
      text: "Screen recordings that polish themselves: auto-zooms, glass looks, music and intros. For Mac.",
    },
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
    body: "Progress should bring more independence, not less. We design toward control over where your data lives, who can see it and what runs on it, and we say plainly where a product isn't there yet.",
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

/** The seven tools Morse folds into one app (from onmorse.com). */
export const tools = [
  "Video call", "Notetaker", "Recordings", "Transcripts",
  "In-call assistant", "Whiteboard", "Booking link",
]

export const faqs = [
  {
    q: "What does Unified Machines build?",
    a: "AI products for companies, designed to last. Morse, for the calendar and everything around meetings, and Friday, for screen recordings on the Mac, are the first two. More are coming across the domains a business runs on.",
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
    q: "Is Friday available today?",
    a: "Yes. Friday runs on macOS 15 or later, on Apple Silicon and Intel, and everything happens on your Mac. Details and downloads are at fridayapp.fun.",
  },
  {
    q: "What comes next?",
    a: "More products in other domains of business, in research now. Each follows the same path: research the day-to-day work, simplify it, and build the smallest product that covers the whole job. We announce each one when it is real.",
  },
  {
    q: "What does “sovereign” mean here?",
    a: "It is the direction we build in: as much control as possible over your data and what runs on it. It is an aim, not a finished state, and where a product falls short of it today, we say so plainly.",
  },
  {
    q: "What do the three symbols mean?",
    a: "The face is human ambition. The cross is machine intelligence. The heart is what happens when the two work as one: meaningful progress. Press them on the desktop above to read more.",
  },
]
