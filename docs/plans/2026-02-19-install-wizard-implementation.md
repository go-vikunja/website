# Install Wizard Implementation Plan

**Goal:** Build an interactive install wizard at `/install` that guides new users through environment/method selection and generates copy-pasteable install commands and configs.

**Architecture:** A static Astro page with vanilla JS for client-side interactivity. Three steps (environment, method, output) with live template generation using JS template literals. No server-side logic, no framework — just DOM manipulation and string interpolation.

**Tech Stack:** Astro, Tailwind CSS, vanilla JavaScript

---

### Task 1: Create the install page skeleton with step navigation

**Files:**
- Create: `src/pages/install.astro`
- Create: `src/scripts/install-wizard.js`

**Step 1: Create `src/pages/install.astro`**

This page uses `Layout.astro` directly (no docs sidebar). It contains three step containers, a step indicator, and a back button. All three steps are rendered in the HTML but only the active one is visible.

```astro
---
import Layout from '../layouts/Layout.astro'
---
<Layout title="Install Vikunja" description="Get Vikunja up and running in minutes with this interactive install wizard.">
    <main class="max-w-(--breakpoint-xl) mx-auto px-4 md:px-6">
        <div class="pt-24 pb-8 text-center">
            <h1 class="text-4xl font-display">Install Vikunja</h1>
            <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">Get up and running in minutes.</p>
        </div>

        <!-- Step indicator -->
        <div id="step-indicator" class="flex items-center justify-center gap-2 mb-12">
            <span data-step-dot="1" class="w-3 h-3 rounded-full bg-primary"></span>
            <span data-step-dot="2" class="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            <span data-step-dot="3" class="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></span>
        </div>

        <!-- Step 1: Pick environment -->
        <section id="step-1" class="wizard-step">
            <h2 class="text-2xl font-display text-center mb-8">What environment are you installing on?</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <button data-env="debian" class="wizard-card">
                    <span class="text-lg font-bold">Linux</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">Debian / Ubuntu</span>
                </button>
                <button data-env="fedora" class="wizard-card">
                    <span class="text-lg font-bold">Linux</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">Fedora / CentOS</span>
                </button>
                <button data-env="linux-other" class="wizard-card">
                    <span class="text-lg font-bold">Linux</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">Other</span>
                </button>
                <button data-env="freebsd" class="wizard-card">
                    <span class="text-lg font-bold">FreeBSD</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">Build from source</span>
                </button>
                <button data-env="docker" class="wizard-card">
                    <span class="text-lg font-bold">Docker</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">Docker Compose</span>
                </button>
                <button data-env="kubernetes" class="wizard-card">
                    <span class="text-lg font-bold">Kubernetes</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">Helm chart</span>
                </button>
            </div>
        </section>

        <!-- Step 2: Pick method -->
        <section id="step-2" class="wizard-step hidden">
            <button id="back-to-1" class="wizard-back mb-8">&larr; Back</button>
            <h2 class="text-2xl font-display text-center mb-8">How do you want to install Vikunja?</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <button data-method="docker" class="wizard-card">
                    <span class="text-lg font-bold">Docker</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">Recommended</span>
                </button>
                <button data-method="native" class="wizard-card">
                    <span class="text-lg font-bold">Native</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400" id="native-method-label">Package manager</span>
                </button>
            </div>
        </section>

        <!-- Step 3: Your setup -->
        <section id="step-3" class="wizard-step hidden">
            <button id="back-to-prev" class="wizard-back mb-8">&larr; Back</button>
            <h2 class="text-2xl font-display text-center mb-2">Your setup</h2>
            <p class="text-center text-gray-600 dark:text-gray-400 mb-8" id="setup-summary"></p>

            <!-- Customization accordions -->
            <div class="max-w-3xl mx-auto mb-8 space-y-2" id="customization-options">
                <!-- Database -->
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <button class="accordion-toggle w-full flex items-center justify-between p-4 text-left font-bold" data-accordion="db">
                        <span>Customize database</span>
                        <svg class="accordion-chevron w-5 h-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    <div class="accordion-content hidden px-4 pb-4">
                        <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">SQLite works great for personal use. Pick PostgreSQL or MySQL for multi-user setups.</p>
                        <div class="flex flex-wrap gap-4">
                            <label class="flex items-center gap-2"><input type="radio" name="db" value="sqlite" checked class="text-primary"> SQLite</label>
                            <label class="flex items-center gap-2"><input type="radio" name="db" value="postgres" class="text-primary"> PostgreSQL</label>
                            <label class="flex items-center gap-2"><input type="radio" name="db" value="mysql" class="text-primary"> MySQL / MariaDB</label>
                        </div>
                    </div>
                </div>

                <!-- Email -->
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <button class="accordion-toggle w-full flex items-center justify-between p-4 text-left font-bold" data-accordion="email">
                        <span>Configure email (SMTP)</span>
                        <svg class="accordion-chevron w-5 h-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    <div class="accordion-content hidden px-4 pb-4">
                        <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Optional. Required for email notifications and password resets.</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">SMTP Host</label>
                                <input type="text" id="smtp-host" placeholder="smtp.example.com" class="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">SMTP Port</label>
                                <input type="number" id="smtp-port" placeholder="587" class="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Username</label>
                                <input type="text" id="smtp-user" placeholder="user@example.com" class="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Password</label>
                                <input type="password" id="smtp-password" placeholder="password" class="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium mb-1">From Address</label>
                                <input type="email" id="smtp-from" placeholder="vikunja@example.com" class="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Reverse Proxy -->
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <button class="accordion-toggle w-full flex items-center justify-between p-4 text-left font-bold" data-accordion="proxy">
                        <span>Set up reverse proxy</span>
                        <svg class="accordion-chevron w-5 h-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    <div class="accordion-content hidden px-4 pb-4">
                        <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Recommended for production. Handles TLS/SSL and domain routing.</p>
                        <div class="flex flex-wrap gap-4 mb-4">
                            <label class="flex items-center gap-2"><input type="radio" name="proxy" value="none" checked class="text-primary"> None</label>
                            <label class="flex items-center gap-2"><input type="radio" name="proxy" value="nginx" class="text-primary"> Nginx</label>
                            <label class="flex items-center gap-2"><input type="radio" name="proxy" value="apache" class="text-primary"> Apache</label>
                            <label class="flex items-center gap-2"><input type="radio" name="proxy" value="caddy" class="text-primary"> Caddy</label>
                        </div>
                        <div id="proxy-domain-field" class="hidden">
                            <label class="block text-sm font-medium mb-1">Domain</label>
                            <input type="text" id="proxy-domain" placeholder="vikunja.example.com" class="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Generated output -->
            <div id="output-blocks" class="max-w-3xl mx-auto space-y-6">
                <!-- JS will render code blocks here -->
            </div>

            <!-- What's next -->
            <div class="max-w-3xl mx-auto mt-16 mb-16 border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 class="text-xl font-display mb-4">What's next?</h3>
                <ul class="space-y-2 text-gray-600 dark:text-gray-400">
                    <li><a href="/docs/config-options" class="text-primary hover:underline">Configuration options</a> — Fine-tune your Vikunja instance</li>
                    <li><a href="/docs/openid" class="text-primary hover:underline">OpenID Connect</a> — Set up SSO authentication</li>
                    <li><a href="/docs/ldap" class="text-primary hover:underline">LDAP</a> — Connect to your directory service</li>
                    <li><a href="/docs/what-to-backup" class="text-primary hover:underline">Backups</a> — Keep your data safe</li>
                    <li><a href="/docs/installing" class="text-primary hover:underline">Full installation docs</a> — All the details</li>
                </ul>
            </div>
        </section>
    </main>

    <script src="../scripts/install-wizard.js"></script>
</Layout>

<style>
    @reference '../styles/global.css';

    .wizard-card {
        @apply flex flex-col items-center justify-center gap-1 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer transition hover:border-primary hover:shadow-sm;
    }

    .wizard-card:focus {
        @apply outline-none ring-2 ring-primary ring-offset-2;
    }

    .wizard-back {
        @apply text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition;
    }

    .accordion-toggle[aria-expanded="true"] .accordion-chevron {
        transform: rotate(180deg);
    }
</style>
```

**Step 2: Create `src/scripts/install-wizard.js`**

Start with just step navigation logic — no template generation yet. The JS manages wizard state and step visibility.

```js
document.addEventListener('DOMContentLoaded', () => {
  const state = {
    env: null,      // 'debian' | 'fedora' | 'linux-other' | 'freebsd' | 'docker' | 'kubernetes'
    method: null,   // 'docker' | 'native'
    db: 'sqlite',
    smtp: { host: '', port: '', user: '', password: '', from: '' },
    proxy: 'none',
    proxyDomain: '',
  }

  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
  ]
  const dots = document.querySelectorAll('[data-step-dot]')

  // Environments that skip step 2
  const singleMethodEnvs = {
    freebsd: 'native',
    docker: 'docker',
    kubernetes: 'native',
  }

  function showStep(n) {
    steps.forEach((s, i) => {
      s.classList.toggle('hidden', i !== n)
    })
    dots.forEach((d, i) => {
      d.classList.toggle('bg-primary', i <= n)
      d.classList.toggle('bg-gray-300', i > n)
      d.classList.toggle('dark:bg-gray-600', i > n)
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Step 1: environment cards
  document.querySelectorAll('[data-env]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.env = btn.dataset.env
      if (singleMethodEnvs[state.env]) {
        state.method = singleMethodEnvs[state.env]
        showStep(2)
        renderOutput()
      } else {
        updateNativeLabel()
        showStep(1)
      }
      updateSummary()
    })
  })

  // Step 2: method cards
  document.querySelectorAll('[data-method]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.method = btn.dataset.method
      showStep(2)
      updateSummary()
      renderOutput()
    })
  })

  // Back buttons
  document.getElementById('back-to-1').addEventListener('click', () => showStep(0))
  document.getElementById('back-to-prev').addEventListener('click', () => {
    if (singleMethodEnvs[state.env]) {
      showStep(0)
    } else {
      showStep(1)
    }
  })

  // Update native method label based on env
  function updateNativeLabel() {
    const label = document.getElementById('native-method-label')
    const labels = {
      debian: 'Debian package (.deb)',
      fedora: 'RPM package',
      'linux-other': 'Binary download',
    }
    label.textContent = labels[state.env] || 'Package manager'
  }

  // Update the summary text on step 3
  function updateSummary() {
    const envNames = {
      debian: 'Debian/Ubuntu',
      fedora: 'Fedora/CentOS',
      'linux-other': 'Linux',
      freebsd: 'FreeBSD',
      docker: 'Docker',
      kubernetes: 'Kubernetes',
    }
    const methodNames = {
      docker: 'Docker Compose',
      native: state.env === 'freebsd' ? 'build from source' :
              state.env === 'kubernetes' ? 'Helm chart' : 'native packages',
    }
    const el = document.getElementById('setup-summary')
    el.textContent = `${envNames[state.env]} with ${methodNames[state.method]}`
  }

  // Accordion toggles
  document.querySelectorAll('.accordion-toggle').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false')
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling
      const expanded = btn.getAttribute('aria-expanded') === 'true'
      btn.setAttribute('aria-expanded', String(!expanded))
      content.classList.toggle('hidden')
    })
  })

  // Customization change listeners — re-render output on any change
  document.querySelectorAll('input[name="db"]').forEach(r => {
    r.addEventListener('change', () => { state.db = r.value; renderOutput() })
  })

  document.querySelectorAll('input[name="proxy"]').forEach(r => {
    r.addEventListener('change', () => {
      state.proxy = r.value
      document.getElementById('proxy-domain-field').classList.toggle('hidden', r.value === 'none')
      renderOutput()
    })
  })

  document.getElementById('proxy-domain').addEventListener('input', (e) => {
    state.proxyDomain = e.target.value
    renderOutput()
  })

  // SMTP fields
  ;['smtp-host', 'smtp-port', 'smtp-user', 'smtp-password', 'smtp-from'].forEach(id => {
    document.getElementById(id).addEventListener('input', (e) => {
      const key = id.replace('smtp-', '')
      state.smtp[key] = e.target.value
      renderOutput()
    })
  })

  function renderOutput() {
    const blocks = generateOutput(state)
    const container = document.getElementById('output-blocks')
    container.innerHTML = blocks.map(block => `
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-mono text-gray-500 dark:text-gray-400">${block.filename}</span>
          <button class="copy-btn text-xs text-gray-500 hover:text-primary transition px-2 py-1 rounded border border-gray-200 dark:border-gray-700" data-copy>
            Copy
          </button>
        </div>
        <pre class="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm leading-relaxed"><code>${escapeHtml(block.content)}</code></pre>
      </div>
    `).join('')

    // Bind copy buttons
    container.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.closest('div').nextElementSibling.querySelector('code').textContent
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = 'Copied!'
          setTimeout(() => { btn.textContent = 'Copy' }, 2000)
        })
      })
    })
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  // --- Template generation functions ---
  // (Task 2 fills these in)
  function generateOutput(s) {
    // Placeholder — returns empty until templates are wired up
    return [{ filename: 'Loading...', content: 'Template generation coming next.' }]
  }
})
```

**Step 3: Verify the page loads**

Run: `cd /home/konrad/www/vikunja/website-next && pnpm dev`

Navigate to `http://localhost:4321/install`. Verify:
- Title and subtitle render
- Six environment cards are visible
- Clicking a Linux card shows step 2 with Docker/Native options
- Clicking Docker/FreeBSD/Kubernetes skips to step 3
- Back buttons work
- Accordions open/close
- Step dots update

**Step 4: Commit**

```bash
git add src/pages/install.astro src/scripts/install-wizard.js
git commit -m "feat: add install wizard page skeleton with step navigation"
```

---

### Task 2: Implement Docker Compose template generation

**Files:**
- Modify: `src/scripts/install-wizard.js`

Replace the placeholder `generateOutput` function with real template generators. Start with the Docker path since it covers Docker, and any Linux env that chose Docker as the method.

**Step 1: Implement the Docker Compose generator**

Replace the `generateOutput` function at the bottom of `install-wizard.js`:

```js
function generateOutput(s) {
  if (s.method === 'docker') return generateDocker(s)
  if (s.env === 'debian') return generateDebian(s)
  if (s.env === 'fedora') return generateFedora(s)
  if (s.env === 'linux-other') return generateBinary(s)
  if (s.env === 'freebsd') return generateFreeBSD(s)
  if (s.env === 'kubernetes') return generateKubernetes(s)
  return []
}

function generateDocker(s) {
  const blocks = []
  const publicUrl = s.proxy !== 'none' && s.proxyDomain
    ? `https://${s.proxyDomain}/`
    : 'http://<your-server-ip>:3456/'

  let compose = `services:
  vikunja:
    image: vikunja/vikunja
    environment:
      VIKUNJA_SERVICE_PUBLICURL: ${publicUrl}
      VIKUNJA_SERVICE_JWTSECRET: <change-this-to-a-random-secret>`

  if (s.db === 'postgres') {
    compose += `
      VIKUNJA_DATABASE_HOST: db
      VIKUNJA_DATABASE_PASSWORD: changeme
      VIKUNJA_DATABASE_TYPE: postgres
      VIKUNJA_DATABASE_USER: vikunja
      VIKUNJA_DATABASE_DATABASE: vikunja`
  } else if (s.db === 'mysql') {
    compose += `
      VIKUNJA_DATABASE_HOST: db
      VIKUNJA_DATABASE_PASSWORD: changeme
      VIKUNJA_DATABASE_TYPE: mysql
      VIKUNJA_DATABASE_USER: vikunja
      VIKUNJA_DATABASE_DATABASE: vikunja`
  } else {
    compose += `
      VIKUNJA_DATABASE_PATH: /db/vikunja.db`
  }

  if (hasSmtp(s)) {
    compose += `
      VIKUNJA_MAILER_ENABLED: "true"
      VIKUNJA_MAILER_HOST: "${s.smtp.host}"
      VIKUNJA_MAILER_PORT: "${s.smtp.port || '587'}"
      VIKUNJA_MAILER_USERNAME: "${s.smtp.user}"
      VIKUNJA_MAILER_PASSWORD: "${s.smtp.password}"
      VIKUNJA_MAILER_FROMEMAIL: "${s.smtp.from}"`
  }

  compose += `
    ports:
      - 3456:3456
    volumes:
      - ./files:/app/vikunja/files`

  if (s.db === 'sqlite') {
    compose += `
      - ./db:/db`
  }

  if (s.db !== 'sqlite') {
    compose += `
    depends_on:
      db:
        condition: service_healthy`
  }

  compose += `
    restart: unless-stopped`

  if (s.db === 'postgres') {
    compose += `
  db:
    image: postgres:18
    environment:
      POSTGRES_PASSWORD: changeme
      POSTGRES_USER: vikunja
    volumes:
      - ./db:/var/lib/postgresql
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -h localhost -U $$POSTGRES_USER"]
      interval: 2s
      start_period: 30s`
  } else if (s.db === 'mysql') {
    compose += `
  db:
    image: mariadb:10
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    environment:
      MYSQL_ROOT_PASSWORD: supersecret
      MYSQL_USER: vikunja
      MYSQL_PASSWORD: changeme
      MYSQL_DATABASE: vikunja
    volumes:
      - ./db:/var/lib/mysql
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h localhost -u $$MYSQL_USER --password=$$MYSQL_PASSWORD"]
      interval: 2s
      start_period: 30s`
  }

  blocks.push({ filename: 'docker-compose.yml', content: compose })

  // Shell commands
  let shell = 'mkdir files db\nchown 1000 files db\ndocker compose up -d'
  blocks.push({ filename: 'Run these commands', content: shell })

  // Reverse proxy config
  const proxyBlock = generateProxyConfig(s)
  if (proxyBlock) blocks.push(proxyBlock)

  return blocks
}

function hasSmtp(s) {
  return s.smtp.host && s.smtp.host.trim() !== ''
}
```

**Step 2: Test the Docker path**

Run: `pnpm dev`

Navigate to `/install`, pick any env, choose Docker, verify:
- SQLite default generates a compose file with no `db` service
- Picking PostgreSQL adds the postgres service with healthcheck
- Picking MySQL adds mariadb service
- SMTP fields add mailer env vars
- The "Run these commands" block appears

**Step 3: Commit**

```bash
git add src/scripts/install-wizard.js
git commit -m "feat: implement Docker Compose template generation for install wizard"
```

---

### Task 3: Implement native install template generators

**Files:**
- Modify: `src/scripts/install-wizard.js`

Add the `generateDebian`, `generateFedora`, `generateBinary`, `generateFreeBSD`, and `generateKubernetes` functions.

**Step 1: Add the native generators**

Append to `install-wizard.js`:

```js
function generateNativeConfig(s) {
  // Generates a config.yml snippet for native installs
  const publicUrl = s.proxy !== 'none' && s.proxyDomain
    ? `https://${s.proxyDomain}/`
    : 'http://<your-server-ip>:3456/'

  let config = `service:
  publicurl: "${publicUrl}"
  jwtsecret: "<change-this-to-a-random-secret>"`

  if (s.db === 'postgres') {
    config += `

database:
  type: postgres
  host: localhost
  user: vikunja
  password: changeme
  database: vikunja`
  } else if (s.db === 'mysql') {
    config += `

database:
  type: mysql
  host: localhost
  user: vikunja
  password: changeme
  database: vikunja`
  }

  if (hasSmtp(s)) {
    config += `

mailer:
  enabled: true
  host: "${s.smtp.host}"
  port: ${s.smtp.port || 587}
  username: "${s.smtp.user}"
  password: "${s.smtp.password}"
  fromemail: "${s.smtp.from}"`
  }

  return config
}

function generateDebian(s) {
  const blocks = []

  let cmds = `# Download and install Vikunja
wget https://dl.vikunja.io/vikunja/vikunja-latest-amd64.deb
sudo dpkg -i vikunja-latest-amd64.deb`

  if (s.db === 'postgres') {
    cmds += `

# Install PostgreSQL
sudo apt install -y postgresql
sudo -u postgres createuser vikunja
sudo -u postgres createdb -O vikunja vikunja
sudo -u postgres psql -c "ALTER USER vikunja PASSWORD 'changeme';"`
  } else if (s.db === 'mysql') {
    cmds += `

# Install MariaDB
sudo apt install -y mariadb-server
sudo mysql -e "CREATE DATABASE vikunja; CREATE USER 'vikunja'@'localhost' IDENTIFIED BY 'changeme'; GRANT ALL PRIVILEGES ON vikunja.* TO 'vikunja'@'localhost'; FLUSH PRIVILEGES;"`
  }

  if (s.proxy !== 'none') {
    const proxyPkg = { nginx: 'nginx', apache: 'apache2', caddy: 'caddy' }
    cmds += `

# Install ${s.proxy}
sudo apt install -y ${proxyPkg[s.proxy]}`
  }

  cmds += `

# Start Vikunja
sudo systemctl enable --now vikunja`

  blocks.push({ filename: 'Install commands', content: cmds })
  blocks.push({ filename: '/etc/vikunja/config.yml', content: generateNativeConfig(s) })

  const proxyBlock = generateProxyConfig(s)
  if (proxyBlock) blocks.push(proxyBlock)

  return blocks
}

function generateFedora(s) {
  const blocks = []

  let cmds = `# Download and install Vikunja
wget https://dl.vikunja.io/vikunja/vikunja-latest-x86_64.rpm
sudo rpm -i vikunja-latest-x86_64.rpm`

  if (s.db === 'postgres') {
    cmds += `

# Install PostgreSQL
sudo dnf install -y postgresql-server postgresql
sudo postgresql-setup --initdb
sudo systemctl enable --now postgresql
sudo -u postgres createuser vikunja
sudo -u postgres createdb -O vikunja vikunja
sudo -u postgres psql -c "ALTER USER vikunja PASSWORD 'changeme';"`
  } else if (s.db === 'mysql') {
    cmds += `

# Install MariaDB
sudo dnf install -y mariadb-server
sudo systemctl enable --now mariadb
sudo mysql -e "CREATE DATABASE vikunja; CREATE USER 'vikunja'@'localhost' IDENTIFIED BY 'changeme'; GRANT ALL PRIVILEGES ON vikunja.* TO 'vikunja'@'localhost'; FLUSH PRIVILEGES;"`
  }

  if (s.proxy !== 'none') {
    const proxyPkg = { nginx: 'nginx', apache: 'httpd', caddy: 'caddy' }
    cmds += `

# Install ${s.proxy}
sudo dnf install -y ${proxyPkg[s.proxy]}`
  }

  cmds += `

# Start Vikunja
sudo systemctl enable --now vikunja`

  blocks.push({ filename: 'Install commands', content: cmds })
  blocks.push({ filename: '/etc/vikunja/config.yml', content: generateNativeConfig(s) })

  const proxyBlock = generateProxyConfig(s)
  if (proxyBlock) blocks.push(proxyBlock)

  return blocks
}

function generateBinary(s) {
  const blocks = []

  let cmds = `# Download and install Vikunja
wget https://dl.vikunja.io/vikunja/vikunja-latest-linux-amd64-full.zip
mkdir -p /opt/vikunja
unzip vikunja-latest-linux-amd64-full.zip -d /opt/vikunja
chmod +x /opt/vikunja/vikunja
sudo ln -s /opt/vikunja/vikunja /usr/bin/vikunja`

  cmds += `

# Start Vikunja
sudo systemctl enable --now vikunja`

  blocks.push({ filename: 'Install commands', content: cmds })

  // Systemd unit file
  const unit = `[Unit]
Description=Vikunja
After=syslog.target
After=network.target

[Service]
RestartSec=2s
Type=simple
WorkingDirectory=/opt/vikunja
ExecStart=/usr/bin/vikunja
Restart=always

[Install]
WantedBy=multi-user.target`

  blocks.push({ filename: '/etc/systemd/system/vikunja.service', content: unit })
  blocks.push({ filename: '/opt/vikunja/config.yml', content: generateNativeConfig(s) })

  const proxyBlock = generateProxyConfig(s)
  if (proxyBlock) blocks.push(proxyBlock)

  return blocks
}

function generateFreeBSD(s) {
  const blocks = []

  const cmds = `# Install dependencies
pkg update && pkg upgrade -y
pkg install nano git go gmake
go install github.com/magefile/mage

# Clone and build Vikunja
mkdir -p /mnt/GO/code.vikunja.io
cd /mnt/GO/code.vikunja.io
git clone https://code.vikunja.io/vikunja
cd vikunja
# Checkout the latest stable version:
# git checkout <version>

# Build frontend and backend
cd frontend
pnpm install
pnpm run build
cd ..
mage build

# Install
mkdir -p /mnt/vikunja
cp /mnt/GO/code.vikunja.io/vikunja/vikunja /mnt/vikunja/
chmod +x /mnt/vikunja/vikunja`

  blocks.push({ filename: 'Build & install commands', content: cmds })

  // rc.d script
  const rcd = `#!/bin/sh

. /etc/rc.subr

name=vikunja
rcvar=vikunja_enable

command="/mnt/vikunja/\${name}"

load_rc_config $name
run_rc_command "$1"`

  blocks.push({ filename: '/etc/rc.d/vikunja', content: rcd })

  const rcConf = `# Add this line to /etc/rc.conf:
vikunja_enable="YES"

# Then start:
service vikunja start`

  blocks.push({ filename: 'Enable on boot', content: rcConf })
  blocks.push({ filename: '/mnt/vikunja/config.yml', content: generateNativeConfig(s) })

  const proxyBlock = generateProxyConfig(s)
  if (proxyBlock) blocks.push(proxyBlock)

  return blocks
}

function generateKubernetes(s) {
  const blocks = []

  let cmds = `# Add the Vikunja Helm repo
helm repo add vikunja https://go-vikunja.github.io/helm-chart/
helm repo update

# Install Vikunja
helm install vikunja vikunja/vikunja`

  if (s.db !== 'sqlite' || hasSmtp(s)) {
    cmds += ` \\
  -f values.yaml`
  }

  blocks.push({ filename: 'Helm install commands', content: cmds })

  // values.yaml if customizations exist
  if (s.db !== 'sqlite' || hasSmtp(s) || s.proxy !== 'none') {
    let values = `# values.yaml — customize as needed`

    if (s.db === 'postgres') {
      values += `
database:
  type: postgres
  host: <your-postgres-host>
  user: vikunja
  password: changeme
  database: vikunja`
    } else if (s.db === 'mysql') {
      values += `
database:
  type: mysql
  host: <your-mysql-host>
  user: vikunja
  password: changeme
  database: vikunja`
    }

    if (hasSmtp(s)) {
      values += `
mailer:
  enabled: true
  host: "${s.smtp.host}"
  port: ${s.smtp.port || 587}
  username: "${s.smtp.user}"
  password: "${s.smtp.password}"
  fromemail: "${s.smtp.from}"`
    }

    blocks.push({ filename: 'values.yaml', content: values })
  }

  // Link to full Helm docs
  blocks.push({ filename: 'More info', content: '# See the full Helm chart documentation:\n# https://github.com/go-vikunja/helm-chart' })

  return blocks
}
```

**Step 2: Test all native paths**

Run: `pnpm dev`

Test each env + method combination:
- Debian + Native → deb install + config
- Fedora + Native → rpm install + config
- Linux other + Native → binary download + systemd unit + config
- FreeBSD → build from source + rc.d script
- Kubernetes → Helm commands

Verify database customization changes the config in each case.

**Step 3: Commit**

```bash
git add src/scripts/install-wizard.js
git commit -m "feat: add native, FreeBSD, and Kubernetes template generators"
```

---

### Task 4: Implement reverse proxy config generation

**Files:**
- Modify: `src/scripts/install-wizard.js`

**Step 1: Add the `generateProxyConfig` function**

This function is already called by all generators. Add it above the generators:

```js
function generateProxyConfig(s) {
  if (s.proxy === 'none') return null

  const domain = s.proxyDomain || 'vikunja.example.com'

  if (s.proxy === 'nginx') {
    return {
      filename: 'nginx.conf',
      content: `server {
    listen       80;
    server_name  ${domain};

    location / {
        proxy_pass http://localhost:3456;
        client_max_body_size 20M;
    }
}`,
    }
  }

  if (s.proxy === 'apache') {
    return {
      filename: 'vikunja.conf (Apache)',
      content: `<VirtualHost *:80>
    ServerName ${domain}

    <Proxy *>
      Require all granted
    </Proxy>
    ProxyPass / http://localhost:3456/
    ProxyPassReverse / http://localhost:3456/
</VirtualHost>`,
    }
  }

  if (s.proxy === 'caddy') {
    return {
      filename: 'Caddyfile',
      content: `${domain} {
    reverse_proxy 127.0.0.1:3456
}`,
    }
  }

  return null
}
```

**Step 2: Test reverse proxy output**

Run: `pnpm dev`

Test each proxy option across Docker and native paths:
- Select Nginx → verify nginx.conf block appears
- Select Apache → verify Apache config appears
- Select Caddy → verify Caddyfile appears
- Change domain field → verify it updates in the config
- Select None → verify no proxy block appears

**Step 3: Commit**

```bash
git add src/scripts/install-wizard.js
git commit -m "feat: add reverse proxy config generation for Nginx, Apache, and Caddy"
```

---

### Task 5: Update homepage link and final polish

**Files:**
- Modify: `src/components/partials/CloudOrSelfHosted.astro:11` — change href from `/docs/installing` to `/install`

**Step 1: Update the homepage link**

In `CloudOrSelfHosted.astro`, change:

```astro
<Button href="/docs/installing" class="mt-4!">
```

to:

```astro
<Button href="/install" class="mt-4!">
```

**Step 2: Verify the full flow**

Run: `pnpm dev`

1. Go to homepage → click "Get Started" → should go to `/install`
2. Walk through all six env cards and verify each path generates correct output
3. Test all customization combinations (each database, SMTP fields, each proxy)
4. Test back navigation preserves state
5. Test copy button works
6. Test dark mode (toggle via existing dark mode button)
7. Test responsive layout (resize browser to mobile width)

**Step 3: Commit**

```bash
git add src/components/partials/CloudOrSelfHosted.astro
git commit -m "feat: link homepage Get Started button to install wizard"
```

---

### Task 6: Build verification

**Files:** None (verification only)

**Step 1: Run the production build**

Run: `pnpm build`

Expected: Build succeeds with no errors. The `/install` page is in the output.

**Step 2: Preview the production build**

Run: `pnpm preview`

Navigate to `http://localhost:4321/install` and verify everything works the same as dev mode.

**Step 3: Commit if any fixes were needed**

If the build revealed issues (e.g. import paths), fix and commit:

```bash
git add -A
git commit -m "fix: resolve build issues with install wizard"
```
