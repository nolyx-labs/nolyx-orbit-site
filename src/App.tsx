import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Activity,
  ArrowRight,
  Bell,
  Check,
  Cloud,
  Copy,
  Database,
  Globe,
  KeyRound,
  ListChecks,
  Lock,
  Network,
  Rocket,
  ScrollText,
  Server,
  ShieldCheck,
  Users,
} from 'lucide-react'

const REPO = 'https://github.com/nolyx-labs/nolyx-orbit'
const doc = (path: string) => `${REPO}/blob/main/${path}`

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

/** Adds `in` once the element scrolls into view. */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in')
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="install">
      <code>{command}</code>
      <button
        className="copy"
        aria-label={copied ? 'Copied' : 'Copy command'}
        onClick={() =>
          navigator.clipboard.writeText(command).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          })
        }
      >
        {copied ? <Check /> : <Copy />}
      </button>
    </div>
  )
}

function Nav() {
  return (
    <header className="nav">
      <div className="wrap">
        <a href="#" className="wordmark">
          <img src="brand/icon.svg" alt="" />
          <span>
            Nolyx <b>Orbit</b>
          </span>
        </a>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#security">Security</a>
          <a href="#architecture">Architecture</a>
          <a href="#get-started">Get started</a>
        </nav>
        <div className="nav-cta">
          <a className="btn" href={REPO}>
            <GitHubIcon /> GitHub
          </a>
          <a className="btn btn-primary" href="#get-started">
            Deploy Orbit
          </a>
        </div>
      </div>
    </header>
  )
}

/** Concentric rings with servers circling the control plane. */
function OrbitRings() {
  return (
    <div className="orbits" aria-hidden="true">
      {[
        { size: 520, dur: 40, dots: 3 },
        { size: 820, dur: 70, dots: 4 },
        { size: 1140, dur: 110, dots: 5 },
      ].map((r, i) => (
        <div
          key={r.size}
          className="ring"
          style={{
            width: r.size,
            height: r.size,
            animationDuration: `${r.dur}s`,
            animationDirection: i % 2 ? 'reverse' : 'normal',
          }}
        >
          {Array.from({ length: r.dots }, (_, d) => (
            <span key={d} className="sat" style={{ transform: `rotate(${(360 / r.dots) * d + i * 25}deg)` }} />
          ))}
        </div>
      ))}
    </div>
  )
}

function Hero() {
  const shot = useReveal<HTMLDivElement>()
  return (
    <section className="hero">
      <OrbitRings />
      <div className="wrap">
        <a className="pill" href={REPO}>
          <span className="tag">Open source</span>
          Self-hosted · One binary
          <ArrowRight size={14} />
        </a>
        <h1>
          <span className="grad">Infrastructure management,</span>
          <br />
          <span className="grad-brand">without Kubernetes.</span>
        </h1>
        <p className="lede">
          Orbit is a control plane you run on your own server. Connect every machine with one command and get deploys,
          logs, uptime, databases and status pages in one place.
        </p>
        <div className="hero-cta">
          <a className="btn btn-primary btn-lg" href="#get-started">
            Get started <ArrowRight size={16} />
          </a>
          <a className="btn btn-lg" href={REPO}>
            <GitHubIcon /> Star on GitHub
          </a>
        </div>
        <CopyCommand command={`git clone ${REPO}.git`} />
      </div>
      <div ref={shot} className="hero-shot">
        <div className="glow-border">
          <img
            src="screens/overview-dark.webp"
            width={2880}
            height={1800}
            alt="The Orbit overview: server, service, container and database health, items that need attention, and resource usage over 24 hours"
          />
        </div>
      </div>
    </section>
  )
}

function Strip() {
  return (
    <div className="strip">
      <div className="wrap">
        {[
          ['0', 'inbound ports on your servers'],
          ['1', 'Go binary and one Postgres'],
          ['1 GB', 'RAM to run the control plane'],
          ['ed25519', 'signature on every command'],
        ].map(([b, s]) => (
          <Reveal key={s} className="stat">
            <b>{b}</b>
            <span>{s}</span>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function HowItWorks() {
  return (
    <section>
      <div className="wrap">
        <Reveal>
          <span className="eyebrow">How it works</span>
          <h2>From zero to a fleet in three commands.</h2>
          <p className="section-lede">
            Run Orbit with Docker Compose, then install a small agent on each server. The agent dials out to Orbit, so
            nothing is exposed.
          </p>
        </Reveal>
        <Reveal className="steps">
          <div className="step">
            <span className="num">01</span>
            <h3>Start the control plane</h3>
            <p>One container and Postgres. Caddy gets the HTTPS certificate for you.</p>
            <div className="term">
              <span className="c">$</span> docker compose --profile https up -d
              {'\n'}
              <span className="ok">✓</span> orbit ready on https://orbit.example.com
            </div>
          </div>
          <div className="step">
            <span className="num">02</span>
            <h3>Connect your servers</h3>
            <p>Paste the install command from Settings → Agents on each machine.</p>
            <div className="term">
              <span className="c">$</span> curl -fsSL …/install.sh | sudo sh
              {'\n'}
              <span className="ok">✓</span> enrolled as worker-1 (eu-central)
            </div>
          </div>
          <div className="step">
            <span className="num">03</span>
            <h3>Watch everything show up</h3>
            <p>Containers, databases and logs appear in seconds. Nothing changes until you act.</p>
            <div className="term">
              <span className="ok">●</span> 6 servers online{'\n'}
              <span className="ok">●</span> 9/9 containers running
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const FEATURES = [
  {
    key: 'servers',
    icon: Server,
    label: 'Servers',
    title: 'Every server at a glance',
    body: 'CPU, memory, disk and network for each machine, grouped by region, with pending security updates and reboots flagged on the overview.',
    points: ['Live resource usage per server', 'Security updates and reboots flagged', 'Docker and Nomad side by side'],
    alt: 'The servers list with status, region, system details and live CPU, memory, disk and network usage',
  },
  {
    key: 'service',
    icon: Rocket,
    label: 'Deploys',
    title: 'Deploys you can trust',
    body: 'Zero-downtime deploys from an image or a Git push, with health checks, automatic rollback and request metrics for every service.',
    points: [
      'Push-to-deploy from GitHub',
      'Health checks and automatic rollback',
      'Import running containers and Compose apps',
    ],
    alt: 'A service page with request rate, error rate and p95 latency charts, deployment history and configuration',
  },
  {
    key: 'logs',
    icon: ScrollText,
    label: 'Logs',
    title: 'Logs from everything, in one place',
    body: 'Search logs from every container and the system services you choose, with secrets masked on the server before they are sent.',
    points: ['Full-text search across servers', 'Secrets masked at the source', 'Forward to your own PostgreSQL'],
    alt: 'Central log search across servers, with level, service and server filters',
  },
  {
    key: 'monitor',
    icon: Activity,
    label: 'Uptime',
    title: 'Uptime, checked from more than one place',
    body: 'HTTP and TCP monitors with response times, outage history and certificate expiry. Your own servers become extra check locations.',
    points: ['Multi-location checks', 'Certificate expiry warnings', 'Outage history and response times'],
    alt: 'A monitor page with uptime percentages, response time, results per location and outage history',
  },
]

const TAB_MS = 7000

function Features() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => setActive((a) => (a + 1) % FEATURES.length), TAB_MS)
    return () => clearTimeout(t)
  }, [active, paused])
  const f = FEATURES[active]

  return (
    <section id="features">
      <div className="wrap">
        <Reveal>
          <span className="eyebrow">Features</span>
          <h2>Everything you reach for, already wired together.</h2>
          <p className="section-lede">
            Monitoring, deploys, logs and uptime share one view of your fleet, so an alert takes you straight to the
            container, the deploy and the log line.
          </p>
        </Reveal>
        <Reveal className="tabs-wrap">
          <div
            className="tabs"
            role="tablist"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {FEATURES.map((t, i) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={i === active}
                className={`tab ${i === active ? 'on' : ''}`}
                onClick={() => setActive(i)}
              >
                <t.icon size={16} />
                {t.label}
                {i === active && (
                  <span
                    className="progress"
                    style={{ animationDuration: `${TAB_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="tab-body" role="tabpanel">
            <div className="tab-copy" key={f.key}>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
              <ul className="checks">
                {f.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div className="glow-border tab-shot">
              {FEATURES.map((t, i) => (
                <img
                  key={t.key}
                  src={`screens/${t.key}-dark.webp`}
                  alt={t.alt}
                  width={2880}
                  height={1800}
                  className={i === active ? 'on' : ''}
                  aria-hidden={i !== active}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** Tracks the pointer so each card's spotlight follows it. */
function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`card ${className}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
      }}
    >
      {children}
    </div>
  )
}

function CardHead({ icon: Icon, title, children }: { icon: typeof Server; title: string; children: ReactNode }) {
  return (
    <>
      <div className="icon">
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
    </>
  )
}

const LOG_LINES = [
  ['info', 'api', 'GET /v1/orders 200 18ms'],
  ['warn', 'worker', 'retrying job sync-invoices (2/5)'],
  ['info', 'api', 'login ok user=maya token=••••••••'],
  ['err', 'billing', 'stripe key sk_live_•••••••• rejected'],
  ['info', 'web', 'GET / 200 4ms'],
  ['info', 'db', 'checkpoint complete: wrote 412 buffers'],
  ['info', 'api', 'POST /v1/hooks 202 31ms'],
  ['warn', 'edge-us', 'cert for status.acme.io expires in 13d'],
]

function LogStream() {
  return (
    <div className="logstream" aria-hidden="true">
      <div className="logscroll">
        {[...LOG_LINES, ...LOG_LINES].map(([lvl, svc, msg], i) => (
          <div key={i} className="logline">
            <span className={`lvl ${lvl}`}>{lvl}</span>
            <span className="svc">{svc}</span>
            <span>{msg}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function UptimeBars() {
  // Deterministic pattern: mostly green, a couple of incidents.
  return (
    <div className="uptime" aria-hidden="true">
      {Array.from({ length: 45 }, (_, i) => (
        <i
          key={i}
          className={i === 17 ? 'e' : i === 31 || i === 32 ? 'w' : ''}
          style={{ animationDelay: `${i * 30}ms` }}
        />
      ))}
    </div>
  )
}

function AlertToasts() {
  return (
    <div className="toasts" aria-hidden="true">
      {[
        ['#e01e5a', 'Slack', 'edge-us is offline'],
        ['#5865f2', 'Discord', 'api p95 latency above 500ms'],
        ['var(--ok)', 'Email', 'edge-us is back online'],
      ].map(([c, ch, msg]) => (
        <div key={ch} className="toast">
          <span className="dot" style={{ background: c }} />
          <b>{ch}</b>
          <span>{msg}</span>
        </div>
      ))}
    </div>
  )
}

function Bento() {
  return (
    <section className="divider">
      <div className="wrap">
        <Reveal>
          <span className="eyebrow">Also included</span>
          <h2>The rest of the stack, built in.</h2>
          <p className="section-lede">No add-ons, no separate products. It all ships in the same binary.</p>
        </Reveal>
        <Reveal className="bento">
          <Card className="wide">
            <CardHead icon={ScrollText} title="Secrets masked before they leave the server">
              Passwords, tokens, API keys, JWTs and private keys are masked by the agent, so they never reach Orbit.
            </CardHead>
            <LogStream />
          </Card>
          <Card>
            <CardHead icon={Bell} title="Alerts where you already are">
              Email, Slack, Discord or webhooks, with maintenance windows that hold them.
            </CardHead>
            <AlertToasts />
          </Card>
          <Card>
            <CardHead icon={Globe} title="Status pages">
              90-day uptime, incidents, scheduled maintenance, subscribers and custom domains.
            </CardHead>
            <UptimeBars />
          </Card>
          <Card>
            <CardHead icon={Database} title="Databases">
              PostgreSQL monitoring, read replicas with promotion, and scheduled backups to S3 or another server.
            </CardHead>
          </Card>
          <Card>
            <CardHead icon={Users} title="Access control">
              Teams, custom roles, single sign-on, two-factor authentication, API keys and a full audit log.
            </CardHead>
          </Card>
          <Card>
            <CardHead icon={Network} title="Orchestration">
              Run apps on single servers, or across a Nomad cluster when you need more.
            </CardHead>
          </Card>
          <Card className="wide">
            <CardHead icon={Cloud} title="Provisioning">
              Create Hetzner Cloud servers from Orbit with the agent already installed. They join your fleet on first
              boot.
            </CardHead>
          </Card>
        </Reveal>
      </div>
    </section>
  )
}

const SECURITY = [
  {
    icon: Network,
    title: 'Outbound only',
    body: 'The agent dials Orbit over HTTPS. Managed servers need no inbound ports.',
  },
  {
    icon: KeyRound,
    title: 'Per-server credentials',
    body: 'A one-time token becomes a random secret. Orbit keeps only its hash.',
  },
  {
    icon: Lock,
    title: 'Signed commands',
    body: 'Signed over ID, server, action, expiry and arguments. No replays, no forgeries.',
  },
  {
    icon: ListChecks,
    title: 'A fixed action list',
    body: 'Anything not on the built-in list, expired or reused is rejected.',
  },
  {
    icon: ShieldCheck,
    title: 'Read-only until asked',
    body: 'Connecting only reports and scans. Every change starts from a person.',
  },
  {
    icon: ScrollText,
    title: 'Audited twice',
    body: "Every action is in Orbit's audit log and in a local log on the server.",
  },
]

function Security() {
  return (
    <section id="security" className="divider">
      <div className="wrap security">
        <Reveal>
          <span className="eyebrow">Security</span>
          <h2>Built so a stolen session can't touch your servers.</h2>
          <p className="section-lede">
            The agent has no remote shell. It only runs a fixed list of actions, and only when the command is signed for
            that exact server.
          </p>
          <div className="signed">
            <div className="signed-head">
              <ShieldCheck size={14} /> command verified
            </div>
            <pre>
              {`{
  "id":      "cmd_01JD8…",
  "server":  "srv_worker-1",
  "action":  "deploy.rollout",
  "expires": "2026-11-02T15:04:05Z",
  "args":    "sha256:9f2c…e81a"
}`}
              <span className="sig">ed25519 · 6b1d…f04c ✓</span>
            </pre>
          </div>
          <a className="btn" href={doc('docs/SECURITY.md')} style={{ marginTop: 24 }}>
            Read the security model <ArrowRight size={16} />
          </a>
        </Reveal>
        <Reveal className="sec-list">
          {SECURITY.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <Icon size={18} className="sec-icon" />
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function Architecture() {
  return (
    <section id="architecture" className="divider">
      <div className="wrap">
        <Reveal>
          <span className="eyebrow">Architecture</span>
          <h2>Boring on purpose.</h2>
          <p className="section-lede">
            No Redis, no queue, no separate realtime service. One Go binary and one PostgreSQL database you already know
            how to back up.
          </p>
        </Reveal>
        <Reveal>
          <div className="arch">
            {`                ┌──────────────────────────────────────────────┐
 Browser ──────▶│ `}
            <b>orbit</b>
            {` (single Go binary)                     │
  SPA + SSE     │  ├─ /            embedded React SPA          │
                │  ├─ /api/v1      JSON API (cookie or API key)│
                │  ├─ /agent/v1    enroll + WebSocket gateway  │
                │  ├─ hub          connected agents, signed cmds│
                │  └─ worker       alerts, backups, retention  │
                └───────────────┬──────────────────────────────┘
                                │ `}
            <b>PostgreSQL</b>
            {` (app data, metrics, logs)
        `}
            <span className="hl">wss:// outbound only</span>
            {`    │
   ┌────────────┬───────────────┴┬────────────┐
 `}
            <span className="hl">agent agent agent agent</span>
          </div>
        </Reveal>
        <Reveal className="choices">
          <div>
            <h3>Metrics and logs in Postgres</h3>
            <p>30 days of metrics and 7 days of searchable logs, with no extra time-series store to run.</p>
          </div>
          <div>
            <h3>Runs on a small VPS</h3>
            <p>1 vCPU and 1 GB of RAM for the control plane. Agents run on amd64 and arm64 Linux.</p>
          </div>
          <div>
            <h3>Yours, end to end</h3>
            <p>Your server, your database, your data. Nothing phones home.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function GetStarted() {
  return (
    <section id="get-started" className="final">
      <div className="wrap">
        <Reveal>
          <img className="mark" src="brand/icon.svg" alt="" />
          <h2>Put your servers in orbit.</h2>
          <p className="section-lede">Free and open source. Up and running in about five minutes.</p>
          <div className="term final-term">
            <span className="c"># 1. download and configure</span>
            {`\ngit clone ${REPO}.git && cd nolyx-orbit\ncp .env.example .env\n\n`}
            <span className="c"># 2. start Orbit with automatic HTTPS</span>
            {'\ndocker compose --profile https up -d --build\n\n'}
            <span className="c"># 3. open https://orbit.example.com/signup</span>
          </div>
          <div className="hero-cta">
            <a className="btn btn-primary btn-lg" href={`${REPO}#quick-start`}>
              Read the quick start <ArrowRight size={16} />
            </a>
            <a className="btn btn-lg" href={REPO}>
              <GitHubIcon /> View on GitHub
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer>
      <div className="wrap">
        <img className="labs" src="brand/logo-horizontal-on-dark.svg" alt="Nolyx Labs" />
        <span>© {new Date().getFullYear()} Nolyx Labs</span>
        <nav>
          <a href={REPO}>GitHub</a>
          <a href={doc('docs/ARCHITECTURE.md')}>Architecture</a>
          <a href={doc('docs/SECURITY.md')}>Security</a>
          <a href={doc('docs/SSO.md')}>Single sign-on</a>
        </nav>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Strip />
        <HowItWorks />
        <Features />
        <Bento />
        <Security />
        <Architecture />
        <GetStarted />
      </main>
      <Footer />
    </>
  )
}
