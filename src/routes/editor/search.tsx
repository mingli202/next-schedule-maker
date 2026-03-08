import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/editor/search')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/editor/search"!</div>
}
