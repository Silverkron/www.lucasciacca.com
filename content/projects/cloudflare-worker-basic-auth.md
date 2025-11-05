---
title: Basic Auth con Cloudflare Worker 
description: Come aggiungere un Basic Auth senza modificare il codice del proprio sito utilizzando Cloudflare Worker
date: 2024-12-11 22:01:35 +0300
subtitle: Worker
image: '/images/cloudflare-worker-basic-auth/cloudflare-basi-auth.webp'
---

Un Cloudflare Worker che implementa l'autenticazione HTTP Basic per proteggere le tue risorse web. Il worker intercetta tutte le richieste in arrivo e richiede l'autenticazione prima di permettere l'accesso alle risorse protette.

## 🚀 Caratteristiche

- Implementazione HTTP Basic Authentication
- Supporto completo TypeScript
- Gestione sicura delle credenziali tramite variabili d'ambiente
- Configurazione separata per ambienti di development e production
- Gestione degli errori robusta
- Compatibile con tutti i browser moderni

## 📋 Prerequisiti

- Node.js (versione 16 o superiore)
- Account Cloudflare
- Cloudflare Wrangler CLI

## 🛠️ Installazione

**Installa le dipendenze**
```bash
npm install
```

**Configura le variabili d'ambiente**

Per l'ambiente di development:
```bash
wrangler secret put AUTH_USERNAME --env development
# Inserisci il tuo username
wrangler secret put AUTH_PASSWORD --env development
# Inserisci la tua password
```

Per l'ambiente di production:
```bash
wrangler secret put AUTH_USERNAME --env production
# Inserisci il tuo username
wrangler secret put AUTH_PASSWORD --env production
# Inserisci la tua password
```

## 🚀 Utilizzo

### Sviluppo locale

```bash
npm run dev
```
Questo comando avvierà un server locale per il testing.

### Deploy

Per development:
```bash
npm run deploy
```

Per production:
```bash
npm run deploy:production
```

### Script disponibili

- `npm run dev` - Avvia il server di sviluppo
- `npm run deploy` - Deploy in ambiente development
- `npm run deploy:production` - Deploy in ambiente production
- `npm run build` - Compila il progetto
- `npm run format` - Formatta il codice
- `npm run lint` - Esegue il linting del codice

## 🔒 Come funziona

1. **Intercettazione della richiesta**
* Il worker intercetta tutte le richieste in arrivo al dominio configurato
* Verifica la presenza dell'header di autenticazione

2. **Processo di autenticazione**
* Se l'header di autenticazione non è presente, viene richiesta l'autenticazione
* Il browser mostrerà automaticamente una finestra di login
* Le credenziali vengono inviate in formato base64

3. **Verifica delle credenziali**
* Le credenziali vengono decodificate e verificate
* Se corrette, la richiesta viene inoltrata al backend
* Se errate, viene restituito un errore 401 Unauthorized

4. **Gestione della sicurezza**
* Le credenziali sono memorizzate come variabili d'ambiente sicure
* Supporto per ambienti separati (development/production)
* Gestione degli errori per tentativi di manomissione

## 📁 Struttura del progetto

```
basic-auth-worker/
├── src/
│   └── worker.ts          # Logica principale del worker
├── wrangler.toml         # Configurazione del worker
├── package.json          # Dipendenze e script
```

## ⚙️ Configurazione

### Modifica del dominio

Nel file `wrangler.toml`, modifica la route per il tuo dominio:

```toml
[env.production]
route = "tuo-dominio.com/*"
```

### Modifica delle credenziali

Per modificare le credenziali esistenti:

```bash
# Per development
wrangler secret delete AUTH_USERNAME --env development
wrangler secret delete AUTH_PASSWORD --env development
wrangler secret put AUTH_USERNAME --env development
wrangler secret put AUTH_PASSWORD --env development

# Per production
wrangler secret delete AUTH_USERNAME --env production
wrangler secret delete AUTH_PASSWORD --env production
wrangler secret put AUTH_USERNAME --env production
wrangler secret put AUTH_PASSWORD --env production
```

## 🔍 Testing

Per testare il worker localmente:

1. Avvia il server di sviluppo:
```bash
npm run dev
```

2. Accedi all'URL locale fornito
3. Inserisci le credenziali quando richiesto

Per testare le richieste HTTP direttamente:

```bash
curl -u username:password http://localhost:8787
```

## 🛡️ Sicurezza

- Le credenziali sono sempre trasmesse su HTTPS
- Le variabili d'ambiente sono crittografate
- Implementazione della gestione degli errori per prevenire attacchi
- Supporto per rate limiting tramite Cloudflare

## ⚠️ Limitazioni

- HTTP Basic Auth invia le credenziali con ogni richiesta
- Le credenziali sono codificate in base64 (non crittografate)
- Si consiglia l'uso solo su HTTPS

File `src/worker.ts`
```typescript
interface Env {
  AUTH_USERNAME: string;
  AUTH_PASSWORD: string;
  ENVIRONMENT: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Verifica se l'header Authorization è presente
    const authorization = request.headers.get('Authorization');
    
    if (!authorization) {
      // Se non c'è header di autorizzazione, richiedi l'autenticazione
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
          'Content-Type': 'text/plain'
        }
      });
    }

    // Estrai le credenziali dall'header Authorization
    const [scheme, encoded] = authorization.split(' ');

    // Verifica che lo schema sia "Basic"
    if (!encoded || scheme !== 'Basic') {
      return new Response('Invalid authorization format', { status: 400 });
    }

    try {
      // Decodifica le credenziali da base64
      const buffer = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
      const decoded = new TextDecoder().decode(buffer).toString();
      const [username, password] = decoded.split(':');

      // Verifica le credenziali usando le variabili d'ambiente
      if (username === env.AUTH_USERNAME && password === env.AUTH_PASSWORD) {
        // Se le credenziali sono corrette, passa la richiesta al backend
        return fetch(request);
      }

      // Se le credenziali sono errate, restituisci 401 Unauthorized
      return new Response('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
          'Content-Type': 'text/plain'
        }
      });
    } catch (error) {
      // Gestione degli errori di decodifica
      return new Response('Invalid encoding', { status: 400 });
    }
  }
}
```

File `wrangler.toml`
```toml
name = "basic-auth-worker"
main = "src/worker.ts"
compatibility_date = "2024-01-01"

# Specifica la versione di Workers
workers_dev = true

# Configurazione TypeScript
[build]
command = "npm run build"
watch_dir = "src"

[build.upload]
format = "modules"
main = "./worker.ts"
dir = "src"

# Configurazione dell'ambiente di sviluppo
[env.development]
name = "basic-auth-worker-dev"
workers_dev = true
vars = { ENVIRONMENT = "development" }

# Configurazione dell'ambiente di produzione
[env.production]
name = "basic-auth-worker"
workers_dev = true
route = "example.com/*"  # Sostituisci con il tuo dominio
vars = { ENVIRONMENT = "production" }

# Configurazione delle variabili d'ambiente pubbliche
[vars]
ENVIRONMENT = "production"

# Configurazione delle regole di sicurezza
[security]
allow_credentials = true
```

File `package.json`
```json
{
  "name": "basic-auth-worker",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "deploy": "wrangler deploy",
    "deploy:production": "wrangler deploy --env production",
    "dev": "wrangler dev",
    "build": "wrangler build",
    "format": "prettier --write .",
    "lint": "eslint src/"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.0.0",
    "@types/node": "^18.0.0",
    "@typescript-eslint/eslint-plugin": "^5.0.0",
    "@typescript-eslint/parser": "^5.0.0",
    "eslint": "^8.0.0",
    "eslint-config-prettier": "^8.0.0",
    "prettier": "^2.0.0",
    "typescript": "^5.0.0",
    "wrangler": "^3.0.0"
  }
}
```
