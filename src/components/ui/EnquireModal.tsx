'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, UserIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useReducedMotion } from '@/lib/hooks';
import { EnquireFormData } from '@/types';

interface EnquireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnquireModal = React.memo<EnquireModalProps>(({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<EnquireFormData>({
    name: '',
    phone: '',
    email: '',
    numberOfTravelers: '',
    travelDates: '',
    customNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const prefersReducedMotion = useReducedMotion();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        numberOfTravelers: '',
        travelDates: '',
        customNotes: ''
      });
      setSubmitStatus('idle');
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'enquiry',
          ...formData
        })
      })
      if (!res.ok) {
        throw new Error('Failed to submit')
      }
      setSubmitStatus('success')
      
      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      y: '100%'
    },
    visible: { 
      opacity: 1,
      y: 0
    },
    exit: { 
      opacity: 0,
      y: '100%'
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            variants={prefersReducedMotion ? undefined : backdropVariants}
            initial={prefersReducedMotion ? { opacity: 1 } : "hidden"}
            animate="visible"
            exit="exit"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-t-2xl shadow-2xl w-full max-h-[85vh] min-h-[60vh] overflow-hidden flex flex-col"
            variants={prefersReducedMotion ? undefined : modalVariants}
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : "hidden"}
            animate="visible"
            exit="exit"
            transition={{
              duration: 0.4,
              type: "spring",
              damping: 25,
              stiffness: 200
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/20 hover:bg-black/30 transition-colors duration-200 disabled:opacity-50"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-4 h-4 text-white" />
            </button>

            {/* Kashmir Background Image */}
            <div className="relative h-20 flex-shrink-0 overflow-hidden rounded-t-2xl">
              <Image
                src="/bgfrom.jpg"
                alt="Kashmir landscape with Shikara boat"
                fill
                className="object-cover object-center"
                sizes="(max-width: 400px) 100vw"
                priority
              />
              
              {/* Kashmir Text Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
         
            </div>

            {/* Modal Content */}
            <div className="py-2 px-4 bg-white flex-1 overflow-y-auto flex flex-col">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="text-xl font-extrabold text-black font-heading ml-3 mb-1 pt-1">
                 Let&apos;s Make It Happen!
                </h2>
                <p className="text-gray-600 font-body text-xs">
                  We&apos;ll call you with a perfect plan.
                </p>
              </div>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-800 font-medium text-xs">Thank you! We&apos;ll call you back soon.</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-red-800 font-medium text-xs">Something went wrong. Please try again.</p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name*"
                    required
                    disabled={isSubmitting}
                    className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-all duration-200 font-body disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  />
                </div>

                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number*"
                    required
                    disabled={isSubmitting}
                    className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-all duration-200 font-body disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  />
                </div>

                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                    className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-all duration-200 font-body disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <input
                      type="number"
                      name="numberOfTravelers"
                      value={formData.numberOfTravelers}
                      onChange={handleInputChange}
                      placeholder="Travelers*"
                      required
                      min="1"
                      disabled={isSubmitting}
                      className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-all duration-200 font-body disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    />
                  </div>

                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m0 0h5a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1h5M8 7v5a1 1 0 001 1h6a1 1 0 001-1V7M8 7h8" />
                    </svg>
                    <input
                      type="date"
                      name="travelDates"
                      value={formData.travelDates}
                      onChange={handleInputChange}
                      placeholder="Travel date*"
                      min={new Date().toISOString().split('T')[0]}
                      required
                      disabled={isSubmitting}
                      className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-all duration-200 font-body disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    />
                  </div>
                </div>

                <div className="relative">
                  <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <textarea
                    name="customNotes"
                    value={formData.customNotes}
                    onChange={handleInputChange}
                    placeholder="Special requests (optional)"
                    rows={1}
                    disabled={isSubmitting}
                    className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-all duration-200 font-body disabled:opacity-50 disabled:cursor-not-allowed text-sm resize-none"
                  />
                </div>

                <div className="flex-1"></div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  loadingText="SUBMITTING..."
                  className="w-full bg-gradient-to-r from-teal-800 to-teal-900 hover:from-teal-800 hover:to-teal-900 text-white font-bold py-2 px-6 rounded-lg text-sm transition-all duration-300 font-cta uppercase tracking-wide mt-auto"
                  size="lg"
                >
                   Get My Custom Plan
                </Button>
              </form>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

EnquireModal.displayName = 'EnquireModal';

export default EnquireModal; 