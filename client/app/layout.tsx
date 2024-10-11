"use client"
import "@/styles/globals.css"; // Import your global styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { QueryClientProvider,QueryClient } from "react-query";
import { ReactNode } from "react";
import { queryClient } from "./providers/query";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
   
    <html lang="en">
      <head>
        <title>Chat Applicataion</title>
        <meta name="description" content="Your app description here" />
      
      </head>
      <QueryClientProvider client={queryClient}>
      <body>
        {children} 
      </body>
      </QueryClientProvider>
    </html>
  
  );
}
