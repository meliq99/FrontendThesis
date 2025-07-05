import { createFileRoute } from '@tanstack/react-router'
import SimpleLayout from '@/layouts/SimpleLayout'
import Devices from '@/features/devices/Devices'

export const Route = createFileRoute('/devices')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SimpleLayout>
      <Devices />
    </SimpleLayout>
  )
}
