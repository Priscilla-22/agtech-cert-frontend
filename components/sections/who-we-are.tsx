import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function WhoWeAreSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Staggered Images */}
          <div className="relative">
            <div className="flex gap-4 justify-center lg:justify-start">
              {/* First Image - Left, Higher Position */}
              <div className="relative">
                <div className="relative w-64 h-80 bg-white rounded-lg shadow-lg overflow-hidden transform translate-y-0">
                  <Image
                    src="/pic1.png"
                    alt="Farmer smiling and holding a wooden crate filled with leafy vegetables"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Second Image - Right, Lower Position */}
              <div className="relative">
                <div className="relative w-64 h-80 bg-white rounded-lg shadow-lg overflow-hidden transform translate-y-8">
                  <Image
                    src="/pic2.png"
                    alt="Farmers working together, harvesting crops"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Small heading with decorative line */}
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="w-12 h-px bg-gray-300"></div>
              <span className="text-sm font-medium text-gray-600 tracking-wider uppercase">
                Who We Are
              </span>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight">
                Rooted in Tradition,{" "}
                <span className="block">Growing for Tomorrow</span>
              </h2>
              <p className="text-xl font-medium text-gray-800">
                Empowering sustainable agriculture through trusted organic certification
              </p>
            </div>

            {/* Body Paragraphs */}
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed text-lg">
                For over a decade, we have been at the forefront of organic agriculture certification,
                working hand-in-hand with farmers to ensure the highest standards of sustainable farming
                practices. Our commitment goes beyond certification – we're building a community of
                environmentally conscious growers.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                From small-scale family farms to large agricultural operations, we provide comprehensive
                support, training, and certification services that help farmers transition to and maintain
                organic practices while ensuring market access and premium pricing for their crops.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                className="px-8 py-4 rounded-full text-white font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                style={{ backgroundColor: '#1f3408' }}
              >
                More About Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}