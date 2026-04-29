import { ConfigStore } from '@kinvolk/headlamp-plugin/lib';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { FortemConfig } from './api';

export const store = new ConfigStore<FortemConfig>('fortem-idp');

export function useFortemConfig(): FortemConfig {
  const useConf = store.useConfig();
  const config = useConf();
  return config ?? { fortemUrl: '', apiToken: '' };
}

function DebouncedTextField(props: {
  label: string;
  helperText: string;
  defaultValue: string;
  type?: string;
  onSave: (value: string) => void;
}) {
  const { label, helperText, defaultValue, type = 'text', onSave } = props;
  const [value, setValue] = useState(defaultValue);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;
    setValue(next);
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => onSave(next), 800);
    setTimer(newTimer);
  }

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  return (
    <TextField
      label={label}
      helperText={helperText}
      value={value}
      type={type}
      onChange={handleChange}
      variant="outlined"
      size="small"
      fullWidth
    />
  );
}

export default function Settings() {
  const config = store.get() ?? { fortemUrl: '', apiToken: '' };
  const [currentConfig, setCurrentConfig] = useState<FortemConfig>(config);

  function handleChange(field: keyof FortemConfig, value: string) {
    const updated = { ...currentConfig, [field]: value };
    store.set(updated);
    setCurrentConfig(store.get() ?? updated);
  }

  return (
    <Box display="flex" flexDirection="column" gap={3} maxWidth={600} pt={2}>
      <Typography variant="h6">Fortem IDP Settings</Typography>
      <DebouncedTextField
        label="Fortem URL"
        helperText="Base URL of your Fortem installation, e.g. https://app.fortem.dev"
        defaultValue={currentConfig.fortemUrl}
        onSave={v => handleChange('fortemUrl', v)}
      />
      <DebouncedTextField
        label="API Token"
        helperText="Bearer token for authenticating with the Fortem API"
        defaultValue={currentConfig.apiToken}
        type="password"
        onSave={v => handleChange('apiToken', v)}
      />
    </Box>
  );
}
