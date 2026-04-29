import { SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import SimpleTable from '@kinvolk/headlamp-plugin/lib/components/common/SimpleTable';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { Environment, fetchEnvironments } from './api';
import { useFortemConfig } from './settings';

type Phase = 'Running' | 'Paused' | 'Provisioning' | 'Pending' | 'Failed' | string;

function phaseColor(phase: Phase): string {
  switch (phase) {
    case 'Running':
      return '#4caf50';
    case 'Paused':
    case 'Provisioning':
      return '#ff9800';
    case 'Failed':
      return '#f44336';
    case 'Pending':
    default:
      return '#9e9e9e';
  }
}

function StatusBadge({ phase }: { phase: Phase }) {
  return (
    <Box display="flex" alignItems="center" gap={0.75}>
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: phaseColor(phase),
          flexShrink: 0,
        }}
      />
      <Typography variant="body2">{phase}</Typography>
    </Box>
  );
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function EnvironmentsList() {
  const config = useFortemConfig();
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchEnvironments(config)
      .then(items => {
        setEnvironments(items);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [config.fortemUrl, config.apiToken]);

  if (loading) {
    return (
      <SectionBox title="Fortem Environments">
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      </SectionBox>
    );
  }

  if (error) {
    return (
      <SectionBox title="Fortem Environments">
        <Box p={2}>
          <Typography color="error">{error}</Typography>
        </Box>
      </SectionBox>
    );
  }

  return (
    <SectionBox title="Fortem Environments">
      <SimpleTable
        emptyMessage="No environments found"
        columns={[
          {
            label: 'Name',
            getter: (env: Environment) => env.name,
          },
          {
            label: 'Namespace',
            getter: (env: Environment) => env.namespace,
          },
          {
            label: 'Cluster',
            getter: (env: Environment) => env.cluster,
          },
          {
            label: 'Team',
            getter: (env: Environment) => env.team,
          },
          {
            label: 'Status',
            getter: (env: Environment) => (
              <StatusBadge phase={env.status?.phase ?? 'Pending'} />
            ),
          },
          {
            label: 'Cost/day',
            getter: (env: Environment) => env.status?.costPerDay ?? '—',
          },
          {
            label: 'Last Updated',
            getter: (env: Environment) => formatDate(env.updatedAt),
          },
          {
            label: '',
            getter: (env: Environment) => {
              const base = config.fortemUrl.replace(/\/$/, '');
              return (
                <Button
                  component={Link}
                  href={`${base}/environments/${env.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  variant="outlined"
                >
                  Open in Fortem
                </Button>
              );
            },
          },
        ]}
        data={environments}
      />
    </SectionBox>
  );
}
