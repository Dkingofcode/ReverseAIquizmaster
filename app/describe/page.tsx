import Header from "@/components/header"
import DescriptionForm from "@/components/description-form"

export default function DescribePage() {
  return (
    <div
      className="relative flex min-h-screen flex-col bg-white overflow-x-hidden"
      style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
    >
      <div className="flex h-full grow flex-col">
        <Header />
        <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
          <DescriptionForm />
        </div>
      </div>
    </div>
  )
}
