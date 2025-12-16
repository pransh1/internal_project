import "./globals.css";

export const metadata = {
  title: "Admin Portal",
  description: "Internal Admin System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-black">
        {children}
      </body>
    </html>
  );
}
