import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/results')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/results"!</div>
}
