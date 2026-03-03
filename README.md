# ai-tech-radar-frontend

[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_ai-tech-radar-frontend&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=DEFRA_ai-tech-radar-frontend)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_ai-tech-radar-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_ai-tech-radar-frontend)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_ai-tech-radar-frontend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=DEFRA_ai-tech-radar-frontend)

This repository contains the Tech Radar maintained by the Defra AI Capabilities and Enablement team (AICE) which can be deployed as a standalone service onto CDP.

This tech radar is a visual guide maintained by the AICE team that documents AI tools, frameworks, techniques and platforms under active consideration. Entries are organised into four quadrants:
- Tools
- Frameworks
- Techniques
- Platforms

Each entry is also assigned to one of four rings that indicate maturity and recommended usage:
- Endorse
- Trial
- Assess
- Hold

## Prerequisites
- Docker
- Docker Compose
- Node.js (v24 LTS)

## Environment variables

The application loads environment variables from `.env` (local) and `compose/aws.env` (when using Compose). A minimal example is provided in `.env.example`.

| Name | Default value | Required | Description |
|-|-|-|-|
| AWS_REGION | eu-west-2 | No | AWS region to access resources in. |
| AWS_DEFAULT_REGION | eu-west-2 | No | Default AWS region to access resources in. |
| AWS_ACCESS_KEY_ID | test | No | AWS Access Key ID. |
| AWS_SECRET_ACCESS_KEY | test | No | AWS Secret Access Key. |
| ACE_SLACK_CHANNEL_URL | "#" | No | URL for the ACE Slack channel used in the site contact link (leave empty to disable). |

Create a local `.env` from the example:

```bash
cp .env.example .env
```

## Running the application

### Docker Compose

This repository includes a Compose file (compose.yaml) that brings up the frontend together with Redis. The frontend service is named `ai-tech-radar-frontend` and listens on port 3000.

Start the full local environment (builds images first):

```bash
docker compose up --build
```

Default environment files used by Compose: `compose/aws.env` and `.env`. The Compose configuration sets useful defaults such as `PORT=3000`, `NODE_ENV=development`, `REDIS_HOST=redis` and `LOCALSTACK_ENDPOINT=http://localstack:4566`.

Once running, open http://localhost:3000 in your browser.

### Via NPM

Use `nvm` to select the correct Node.js version if needed:

```bash
nvm use --lts
```

Install dependencies:

```bash
npm install --ignore-scripts
```

Start the app in development mode (builds radar assets and restarts on change):

```bash
npm run start:dev
```

Build the tech radar static assets (used by the site):

```bash
npm run build:tech-radar
```

Create a production build (webpack + radar generation):

```bash
npm run build
```

Run the compiled site in production mode locally:

```bash
npm start
```

## Tech Radar Data

The radar content is written in YAML at `src/tech-radar/radar.yaml`.

- Top-level arrays: `quadrants` and `rings`.
- Main content: `quadrant_entries` maps each quadrant to the four rings; each ring contains a list of entries.

Each entry is a YAML object containing these fields:

| Field | Type | Description |
|-|-|-|
| `label` | number | Small identifier shown on the radar |
| `title` | string | Entry title |
| `description` | string | Short description of the entry |
| `link` | string | Optional URL for more information |
| `createdTimestamp` | string (ISO 8601) | Creation timestamp |
| `updatedTimestamp` | string (ISO 8601) | Last updated timestamp |
| `active` | boolean | Whether the entry is active/visible |

Example entry (shortened):

```yaml
quadrant_entries:
	Frameworks:
		Assess:
			- label: 1
				title: "MCP"
				description: "Model Context Protocol (MCP)"
				link: "https://modelcontextprotocol.io/overview"
				createdTimestamp: "2025-07-30T10:00:00Z"
				updatedTimestamp: "2025-07-30T10:00:00Z"
				active: true
```

How to update:

1. Edit `src/tech-radar/radar.yaml` in your editor and add or modify entries under the appropriate quadrant and ring.
2. Use ISO 8601 timestamps for `createdTimestamp` / `updatedTimestamp` and set `active` to `true` for visible entries.
3. Regenerate the radar assets:

```bash
npm run build:tech-radar
```

During development the `start:dev` script runs the radar generator in watch mode so changes are rebuilt automatically; otherwise run `npm run build` or `npm run start:dev` to see updates locally.

Generated assets are used by the site; the generator writes the build output into the public assets location (used by the app at runtime).

## Tests

### Test structure

The tests have been structured into subfolders of `./tests` based on the type of test:
- `unit` - unit tests for individual functions and modules
- `integration` - integration tests for interactions between modules and with external services

### Running tests

To run the tests, use the following command:

```bash
npm test
```

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of His Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
