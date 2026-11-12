import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.nabra',
  appName: 'Nabra',
  webDir: 'dist',
  backgroundColor: '#fafaf9',
  android: {
    allowMixedContent: false,
  },
};

export default config;
