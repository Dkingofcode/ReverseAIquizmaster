import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] w-full">
        <div className="container mx-auto">
          <div className="p-4 md:p-0">
            <div
              className="flex min-h-[480px] flex-col gap-6 md:gap-8 rounded-xl items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuC-fqx_JHbox0kxiIikGQThfUlfn1gF6Pi6cJEcO4P2-hMD1dEKJ7XGm2Fdxayi9VWY9-11t6B5iiJmkQdN-Jf9MutX0iHADPxO9mNk8rpV8KgkCnBYo9MqTFFl1Z13WxXCAwH9Jd_5cyfyjwfebIUCHDqjjgLZyYxSc_RwXE5HnUKgkDsX485VvdRXkdnPLBjgPBXBLwHosNvrNAPsTXnb5wkalt8u9osayLPl0tyzrYiyrDuqcEYCoSwmq8Qvxn6lkjNM6c0eX5TI')",
              }}
            >
              <div className="text-center text-white flex flex-col gap-2 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-black tracking-[-0.033em]">Reverse Personality Quiz</h1>
                <h2 className="text-sm md:text-base font-normal leading-normal">
                  Describe yourself, and our AI will guess your personality. Then, others try to guess the AI's
                  assessment based on your description.
                </h2>
              </div>
              <Link href="/describe">
                <Button className="h-10 md:h-12 px-4 md:px-5 rounded-full bg-[#7847ea] hover:bg-[#6a3fd1] text-white text-sm md:text-base font-bold tracking-[0.015em] mt-4">
                  Start or Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
