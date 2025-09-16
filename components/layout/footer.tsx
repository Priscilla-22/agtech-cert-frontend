"use client"

import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, MapPin, Leaf, Facebook, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#1f3408' }} className="text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-white/10 rounded-lg overflow-hidden backdrop-blur-sm">
                <Image
                  src="/pesira-logo .png"
                  alt="Pesira Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">Pesira</h3>
                <p className="text-sm text-white/80">Agronomist Platform</p>
              </div>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              Empowering sustainable agriculture through comprehensive organic certification tracking and management solutions for farmers and agronomists.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-orange-500/20 transition-colors group">
                <Facebook className="w-4 h-4 group-hover:text-orange-400" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-orange-500/20 transition-colors group">
                <Twitter className="w-4 h-4 group-hover:text-orange-400" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-orange-500/20 transition-colors group">
                <Linkedin className="w-4 h-4 group-hover:text-orange-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-white/90 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/farmers" className="text-white/90 hover:text-white transition-colors text-sm">
                  Farmers
                </Link>
              </li>
              <li>
                <Link href="/inspections" className="text-white/90 hover:text-white transition-colors text-sm">
                  Inspections
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="text-white/90 hover:text-white transition-colors text-sm">
                  Certificates
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-white/90 hover:text-white transition-colors text-sm">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Our Services</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/90 text-sm">
                <Leaf className="w-4 h-4 text-orange-400" />
                Organic Certification
              </li>
              <li className="flex items-center gap-2 text-white/90 text-sm">
                <Leaf className="w-4 h-4 text-orange-400" />
                Farm Inspections
              </li>
              <li className="flex items-center gap-2 text-white/90 text-sm">
                <Leaf className="w-4 h-4 text-orange-400" />
                Compliance Tracking
              </li>
              <li className="flex items-center gap-2 text-white/90 text-sm">
                <Leaf className="w-4 h-4 text-orange-400" />
                Digital Certificates
              </li>
              <li className="flex items-center gap-2 text-white/90 text-sm">
                <Leaf className="w-4 h-4 text-orange-400" />
                Training & Support
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/90 text-sm">
                    Nairobi, Kenya
                  </p>
                  <p className="text-white/70 text-xs mt-1">
                    Serving farmers across East Africa
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-400" />
                <a href="mailto:info@pesira.com" className="text-white/90 hover:text-white transition-colors text-sm">
                  info@pesira.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-400" />
                <a href="tel:+254700000000" className="text-white/90 hover:text-white transition-colors text-sm">
                  +254 700 000 000
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/70 text-sm">
              © {new Date().getFullYear()} Pesira Agronomist Platform. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}