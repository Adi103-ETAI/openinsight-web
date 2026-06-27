/**
 * Admin layout — hides the public site Nav & Footer so the dashboard
 * renders as a standalone full-page app without CSS conflicts.
 *
 * The background color is set here as a fallback; the actual dashboard
 * page component manages its own layout (sidebar + main area).
 */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="admin-root"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'auto',
        backgroundColor: '#1C1B1A',
      }}
    >
      {children}
    </div>
  )
}
