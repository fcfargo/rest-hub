declare module 'next-pwa' {
  import { NextConfig } from 'next';

  type PWAOptions = {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    runtimeCaching?: any[];
    buildExcludes?: string[];
    [key: string]: any;
  };

  function withPWA(pwaOptions: PWAOptions): (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}
