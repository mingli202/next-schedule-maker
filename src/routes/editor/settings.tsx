import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/editor/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/editor/settings"!</div>
}
