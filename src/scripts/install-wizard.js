document.addEventListener('DOMContentLoaded', () => {
  const state = {
    platform: null, // 'linux' | 'freebsd' | 'kubernetes'
    env: null,      // 'debian' | 'fedora' | 'linux-other' | 'freebsd' | 'kubernetes'
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

  function showStep(n) {
    steps.forEach((s, i) => {
      s.classList.toggle('hidden', i !== n)
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Step 1: platform cards
  document.querySelectorAll('[data-platform]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.platform = btn.dataset.platform
      if (state.platform === 'linux') {
        showStep(1)
      } else {
        state.env = state.platform
        state.method = 'native'
        showStep(2)
        updateSummary()
        renderOutput()
      }
    })
  })

  // Step 2: Linux install method cards
  document.querySelectorAll('[data-linux-method]').forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.linuxMethod
      if (choice === 'docker') {
        state.env = 'docker'
        state.method = 'docker'
      } else {
        state.env = choice
        state.method = 'native'
      }
      showStep(2)
      updateSummary()
      renderOutput()
    })
  })

  // Back buttons
  document.getElementById('back-to-1').addEventListener('click', () => showStep(0))
  document.getElementById('back-to-prev').addEventListener('click', () => {
    if (state.platform === 'linux') {
      showStep(1)
    } else {
      showStep(0)
    }
  })

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

  function generateOutput(s) {
    if (s.method === 'docker') return generateDocker(s)
    if (s.env === 'debian') return generateDebian(s)
    if (s.env === 'fedora') return generateFedora(s)
    if (s.env === 'linux-other') return generateBinary(s)
    if (s.env === 'freebsd') return generateFreeBSD(s)
    if (s.env === 'kubernetes') return generateKubernetes(s)
    return []
  }

  function hasSmtp(s) {
    return s.smtp.host && s.smtp.host.trim() !== ''
  }

  // --- Docker Compose ---

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

  // --- Native config (shared by Debian, Fedora, Binary, FreeBSD) ---

  function generateNativeConfig(s) {
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

  // --- Debian ---

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

    if (s.proxy !== 'none' && s.proxy !== 'traefik') {
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

  // --- Fedora ---

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

    if (s.proxy !== 'none' && s.proxy !== 'traefik') {
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

  // --- Binary (Linux other) ---

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

  // --- FreeBSD ---

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

  // --- Kubernetes ---

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

  // --- Reverse proxy configs ---

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

    if (s.proxy === 'traefik') {
      return {
        filename: 'docker-compose.yml (Traefik labels)',
        content: `# Add these labels to your Vikunja service:
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.vikunja.rule=Host(\`${domain}\`)"
  - "traefik.http.routers.vikunja.entrypoints=websecure"
  - "traefik.http.routers.vikunja.tls.certresolver=letsencrypt"
  - "traefik.http.services.vikunja.loadbalancer.server.port=3456"`,
      }
    }

    return null
  }
})
