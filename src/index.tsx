import {
  registerPluginSettings,
  registerRoute,
  registerSidebarEntry,
} from '@kinvolk/headlamp-plugin/lib';
import React from 'react';
import ClustersList from './clusters';
import EnvironmentsList from './environments';
import Settings from './settings';

// ── Sidebar: top-level "Fortem" group ──────────────────────────────────────
registerSidebarEntry({
  parent: null,
  name: 'fortem',
  label: 'Fortem',
  url: '/fortem/environments',
  icon: 'mdi:server-network',
});

// Sub-entries under Fortem
registerSidebarEntry({
  parent: 'fortem',
  name: 'fortem-environments',
  label: 'Environments',
  url: '/fortem/environments',
  icon: 'mdi:layers',
});

registerSidebarEntry({
  parent: 'fortem',
  name: 'fortem-clusters',
  label: 'Clusters',
  url: '/fortem/clusters',
  icon: 'mdi:kubernetes',
});

// ── Routes ─────────────────────────────────────────────────────────────────
registerRoute({
  path: '/fortem/environments',
  sidebar: 'fortem-environments',
  name: 'fortem-environments',
  exact: true,
  component: () => <EnvironmentsList />,
});

registerRoute({
  path: '/fortem/clusters',
  sidebar: 'fortem-clusters',
  name: 'fortem-clusters',
  exact: true,
  component: () => <ClustersList />,
});

// ── Plugin Settings ────────────────────────────────────────────────────────
registerPluginSettings('fortem-idp', Settings, false);
