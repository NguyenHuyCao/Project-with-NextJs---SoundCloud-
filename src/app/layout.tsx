import AppHeader from "@/components/header/app.header";
import ThemeRegistry from "@/components/theme-registry/theme.registry";
import AppFooter from "@/components/footer/app.footer";
import NextAuthWrapper from "@/lib/next.auth.wrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NextAuthWrapper>{children}</NextAuthWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
