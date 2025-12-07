"use client"

import Link from "next/link"
import { Modal, ModalTrigger, ModalBody, ModalContent, ModalFooter } from "@/components/ui/animated-modal"
import { Button } from "@/components/ui/button"

export function QuickActionButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <Modal>
        <ModalTrigger className="inline-flex items-center gap-2 px-4 py-2 text-sm text-black dark:text-white backdrop-blur-sm border border-black dark:border-white rounded-md hover:shadow-[0px_0px_4px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0px_0px_4px_4px_rgba(255,255,255,0.1)] bg-white/[0.2] dark:bg-white/[0.1] transition duration-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Browse All Products
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Browse All Products
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Explore our complete collection of loan products tailored to your needs.
            </p>
          </ModalContent>
          <ModalFooter>
            <Link href="/products" className="w-full">
              <Button className="w-full">View All Products</Button>
            </Link>
          </ModalFooter>
        </ModalBody>
      </Modal>

      <Modal>
        <ModalTrigger className="inline-flex items-center gap-2 px-4 py-2 text-sm text-black dark:text-white backdrop-blur-sm border border-black dark:border-white rounded-md hover:shadow-[0px_0px_4px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0px_0px_4px_4px_rgba(255,255,255,0.1)] bg-white/[0.2] dark:bg-white/[0.1] transition duration-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chat Support
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Chat Support
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Get instant answers about loan products and financial planning from our AI assistant.
            </p>
          </ModalContent>
          <ModalFooter>
            <Link href="/chat" className="w-full">
              <Button className="w-full">Start Chat</Button>
            </Link>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  )
}

