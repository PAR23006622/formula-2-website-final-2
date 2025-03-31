"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function Footer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const currentYear = new Date().getFullYear();
  const linkStyles = "transition-all duration-300 hover:text-white/90 hover:translate-x-1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const mailtoLink = `mailto:par23006622@heartofyorkshire.ac.uk?subject=Contact from ${formData.name}&body=${formData.message}%0A%0AFrom: ${formData.email}`;
      window.location.href = mailtoLink;
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  return (
    <footer className="mt-auto">
      <div className="mt-8 mb-4 mx-4">
        <Card className="bg-[#0090d0]/90 backdrop-blur-md text-white/90 p-6 shadow-lg hover:bg-[#0090d0]/90">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Quick Links */}
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/driver-standings" className={linkStyles}>
                      Driver Standings
                    </Link>
                  </li>
                  <li>
                    <Link href="/team-standings" className={linkStyles}>
                      Team Standings
                    </Link>
                  </li>
                  <li>
                    <Link href="/teams-drivers" className={linkStyles}>
                      Teams & Drivers
                    </Link>
                  </li>
                  <li>
                    <Link href="/calendar" className={linkStyles}>
                      Race Calendar
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-semibold mb-4">Contact Us</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="px-4 py-2 bg-white text-[#0090d0] rounded-lg font-semibold hover:bg-white/90 transition-colors duration-200">
                      Email Us
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Contact Form</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#0090d0] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <input
                          type="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#0090d0] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <textarea
                          placeholder="Your Message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          rows={4}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#0090d0] focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 bg-[#0090d0] text-white rounded-lg font-semibold hover:bg-[#0090d0]/90 transition-colors duration-200 disabled:opacity-50"
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </button>
                      {submitStatus === "success" && (
                        <p className="text-green-600 text-sm text-center">Message sent successfully!</p>
                      )}
                      {submitStatus === "error" && (
                        <p className="text-red-600 text-sm text-center">Failed to send message. Please try again.</p>
                      )}
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Legal */}
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy" className={linkStyles}>
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className={linkStyles}>
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/20 text-center text-sm">
              <p>© {currentYear} Formula 2 Analytics. All rights reserved.</p>
            </div>
          </div>
        </Card>
      </div>
    </footer>
  );
}