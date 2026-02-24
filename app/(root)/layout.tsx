import React from 'react'

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <div className="flex min-h-full flex-col">
      <main className="wrapper flex-1">{children}</main>
      {modal}
    </div>
  )
}
