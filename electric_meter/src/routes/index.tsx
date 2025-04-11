import { createFileRoute } from '@tanstack/react-router'

const MainRootComponent = () => {
  return(
    <p>Hello "/"!</p>
  )
}

export const Route = createFileRoute('/')({
  component: MainRootComponent,
})

