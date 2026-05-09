export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-svh bg-background text-foreground lg:grid-cols-2">
      <div className="hidden bg-muted lg:block" />
      {children}
    </main>
  )
}
