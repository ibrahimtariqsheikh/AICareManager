"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import StoreProvider from "../state/redux";
import { Amplify } from "aws-amplify";
import { ThemeProvider } from "../components/theme-provider";
import { SidebarProvider } from "../components/ui/sidebar-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// Configure Amplify
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId:
        process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
    },
  },
});

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <StoreProvider>
      <Authenticator.Provider>
        <SidebarProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </ThemeProvider>
        </SidebarProvider>
      </Authenticator.Provider>
    </StoreProvider>
  );
};

export default Providers;
