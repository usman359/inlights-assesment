declare global {
  interface Window {
    fbAsyncInit?: () => void;
  }

  const FB: {
    init: (params: {
      appId: string;
      cookie: boolean;
      xfbml: boolean;
      version: string;
    }) => void;
    AppEvents: {
      logPageView: () => void;
    };
  };
}
