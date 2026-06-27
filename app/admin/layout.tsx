/**
 * Admin layout — hides the public site Nav & Footer so the dashboard
 * renders as a standalone full-page app without CSS conflicts.
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
        backgroundColor: '#F5F0E8',
      }}
    >
      {children}
    </div>
  )
}
