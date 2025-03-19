"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import StoreProvider from "../state/redux";
import { Amplify } from "aws-amplify";
import { ThemeProvider } from "../components/theme-provider";
import { SidebarProvider } from "../components/ui/sidebar-provider";

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
  return (
    <StoreProvider>
      <Authenticator.Provider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </Authenticator.Provider>
    </StoreProvider>
  );
};

export default Providers;
