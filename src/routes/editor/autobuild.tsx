import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/editor/autobuild')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/editor/autobuild"!</div>
}
