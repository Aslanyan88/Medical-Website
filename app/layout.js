// app/layout.js (the root layout, not the [lang]/layout)
// if you want root layout:
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
