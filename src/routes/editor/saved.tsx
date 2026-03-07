import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/editor/saved')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/editor/saved"!</div>
}
