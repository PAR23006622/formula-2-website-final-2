import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StructuredData } from "@/components/seo/structured-data";
import { generateWebsiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Formula 2 Analytics - Learn how we handle and protect your data.',
  openGraph: {
    title: 'Privacy Policy - Formula 2 Analytics',
    description: 'Learn how Formula 2 Analytics handles and protects your data.',
  }
};

export default function PrivacyPolicy() {
  return (
    <>
      <StructuredData data={generateWebsiteSchema()} />
      <div className="container mx-auto px-4 py-6">
        <Card className="chart-card h-auto mb-8 max-w-[900px] mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground">
                At Formula 2 Analytics, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. 
                If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect information that you voluntarily provide to us when you use our website:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Analytics data about how you use our website</li>
                <li>Technical data such as your browser type and operating system</li>
                <li>Your IP address and general location data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Improve and optimize our website</li>
                <li>Analyze usage patterns and trends</li>
                <li>Maintain the security and integrity of our website</li>
                <li>Respond to your inquiries and communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
                Cookies are files with small amounts of data which may include an anonymous unique identifier. You can instruct 
                your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground">
                We use third-party services that may collect information used to identify you:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Vercel Analytics for website performance monitoring</li>
                <li>Vercel Speed Insights for performance metrics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect your personal information. 
                However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Children&apos;s Privacy</h2>
              <p className="text-muted-foreground">
                Our website is not intended for children under 18 years of age. We do not knowingly collect personal 
                information from children under 18.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page. Changes are effective immediately upon posting.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at the button below at the bottom of the page.
              </p>
            </section>

            <section className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </>
  );
}