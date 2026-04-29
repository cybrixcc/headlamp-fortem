import { SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import SimpleTable from '@kinvolk/headlamp-plugin/lib/components/common/SimpleTable';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { Cluster, fetchClusters } from './api';
import { useFortemConfig } from './settings';

function formatHeartbeat(ts: string | null): string {
  if (!ts) return 'Never';
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}

export default function ClustersList() {
  const config = useFortemConfig();
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchClusters(config)
      .then(items => {
        setClusters(items);
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
      <SectionBox title="Fortem Clusters">
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      </SectionBox>
    );
  }

  if (error) {
    return (
      <SectionBox title="Fortem Clusters">
        <Box p={2}>
          <Typography color="error">{error}</Typography>
        </Box>
      </SectionBox>
    );
  }

  return (
    <SectionBox title="Fortem Clusters">
      <SimpleTable
        emptyMessage="No clusters found"
        columns={[
          {
            label: 'Name',
            getter: (c: Cluster) => c.displayName || c.name,
          },
          {
            label: 'Provider',
            getter: (c: Cluster) => c.provider,
          },
          {
            label: 'Region',
            getter: (c: Cluster) => c.region,
          },
          {
            label: 'Status',
            getter: (c: Cluster) => c.phase,
          },
          {
            label: 'K8s Version',
            getter: (c: Cluster) => c.k8sVersion,
          },
          {
            label: 'Nodes',
            getter: (c: Cluster) => c.nodeCount,
          },
          {
            label: 'Last Heartbeat',
            getter: (c: Cluster) => formatHeartbeat(c.lastHeartbeat),
          },
        ]}
        data={clusters}
      />
    </SectionBox>
  );
}
