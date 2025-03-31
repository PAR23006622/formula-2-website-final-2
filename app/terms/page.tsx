import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StructuredData } from "@/components/seo/structured-data";
import { generateWebsiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Formula 2 Analytics - Read our terms and conditions of use.',
  openGraph: {
    title: 'Terms of Service - Formula 2 Analytics',
    description: 'Read our terms and conditions for using Formula 2 Analytics.',
  }
};

export default function Terms() {
  return (
    <>
      <StructuredData data={generateWebsiteSchema()} />
      <div className="container mx-auto px-4 py-6">
        <Card className="chart-card h-auto mb-8 max-w-[900px] mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Formula 2 Analytics (&quot;the Website&quot;), you agree to be bound by these Terms of Service. 
                If you disagree with any part of these terms, you may not access the Website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Intellectual Property Rights</h2>
              <p className="text-muted-foreground">
                The Website and its original content, features, and functionality are owned by Formula 2 Analytics and are 
                protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. User Responsibilities</h2>
              <p className="text-muted-foreground">
                When using our Website, you agree to:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Use the Website in a manner consistent with all applicable laws and regulations</li>
                <li>Not attempt to gain unauthorized access to any portion of the Website</li>
                <li>Not interfere with or disrupt the Website or servers</li>
                <li>Not harvest or collect user information without consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Disclaimer</h2>
              <p className="text-muted-foreground">
                The Website is provided &quot;as is&quot; and &quot;as available&quot; without any warranties, either express or implied. 
                Formula 2 Analytics does not warrant that the Website will be uninterrupted or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                In no event shall Formula 2 Analytics be liable for any indirect, incidental, special, consequential, or 
                punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible 
                losses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Third-Party Links</h2>
              <p className="text-muted-foreground">
                The Website may contain links to third-party websites that are not owned or controlled by Formula 2 Analytics. 
                We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Data Usage</h2>
              <p className="text-muted-foreground">
                We collect and use data in accordance with our Privacy Policy. By using the Website, you agree to our 
                collection and use of information as described in the Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Termination</h2>
              <p className="text-muted-foreground">
                We reserve the right to terminate or suspend access to our Website immediately, without prior notice or 
                liability, for any reason whatsoever, including without limitation if you breach these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">9. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to 
                provide at least 30 days' notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">10. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us at the button below at the bottom of the page.
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