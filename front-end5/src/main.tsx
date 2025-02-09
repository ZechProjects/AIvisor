import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from "./App";
import "./index.css";
import { AppProvider } from "./contexts/AppContext";

import { PrivyProvider } from "@privy-io/react-auth";

// Create a client for React Query
// const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PrivyProvider
        appId="cm6xiefo8007xenxlzqc6pqjh"
        config={{
          // Display email and wallet as login methods
          loginMethods: ["email", "wallet"],
          // Customize Privy's appearance in your app
          appearance: {
            theme: "light",
            accentColor: "#676FFF",
            logo: "https://your-logo-url",
          },
          // Create embedded wallets for users who don't have a wallet
          embeddedWallets: {
            createOnLogin: "users-without-wallets",
          },
        }}
      >
        <AppProvider>
          {/* <QueryClientProvider client={queryClient}> */}
          <App />
          {/* </QueryClientProvider> */}
        </AppProvider>
      </PrivyProvider>
    </BrowserRouter>
  </React.StrictMode>
);
