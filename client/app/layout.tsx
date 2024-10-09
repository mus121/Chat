// app/layout.tsx

import "@/styles/globals.css"; // Import your global styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Chat Applicataion</title>
        <meta name="description" content="Your app description here" />
        {/* You can also add other meta tags or links here */}
      </head>
      <body>
        {children} {/* Render child components here */}
      </body>
    </html>
  );
}
