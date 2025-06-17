import Header from "@/components/header"
import Hero from "@/components/hero"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white font-sans overflow-x-hidden group/design-root">
      <div className="layout-container flex flex-col h-full grow">
        <Header />
        <Hero />
      </div>
    </div>
  )
}
