export interface Environment {
  id: string;
  name: string;
  namespace: string;
  cluster: string;
  team: string;
  status: {
    phase: string;
    costPerDay: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Cluster {
  id: string;
  name: string;
  displayName: string;
  provider: string;
  region: string;
  phase: string;
  k8sVersion: string;
  nodeCount: number;
  lastHeartbeat: string | null;
}

export interface FortemConfig {
  fortemUrl: string;
  apiToken: string;
}

async function fortemFetch<T>(
  config: FortemConfig,
  path: string
): Promise<T> {
  const { fortemUrl, apiToken } = config;

  if (!fortemUrl) {
    throw new Error('Fortem URL is not configured. Go to Settings > Plugins > Fortem IDP.');
  }
  if (!apiToken) {
    throw new Error('API token is not configured. Go to Settings > Plugins > Fortem IDP.');
  }

  const base = fortemUrl.replace(/\/$/, '');
  const url = `${base}${path}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Fortem API error ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchEnvironments(config: FortemConfig): Promise<Environment[]> {
  const result = await fortemFetch<{ items: Environment[] }>(config, '/api/v1/environments');
  return result.items ?? [];
}

export async function fetchClusters(config: FortemConfig): Promise<Cluster[]> {
  const result = await fortemFetch<{ items: Cluster[] }>(config, '/api/v1/clusters');
  return result.items ?? [];
}
