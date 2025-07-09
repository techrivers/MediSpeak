import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button }
from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl">
        <Button variant="outline" asChild className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground/90">
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h2 className="text-xl font-semibold font-headline mb-2">1. Introduction</h2>
              <p>Welcome to SpeakBridge. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-headline mb-2">2. Information We Collect</h2>
              <p>We may collect information about you in a variety of ways. The information we may collect via the Application includes:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Consultation Data:</strong> Text and speech input provided during consultations for translation and anonymization purposes. This data is processed in real-time and is not stored after the consultation ends.</li>
                <li><strong>Usage Data:</strong> We may collect information about your use of the Application, such as consultation duration and features used, for service improvement and analytics. This data is aggregated and anonymized.</li>
                <li><strong>User Account Data:</strong> For authorized users (doctors), we store your preloaded account information (e.g., name, email) to facilitate secure access.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold font-headline mb-2">3. Use of Your Information</h2>
              <p>Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Facilitate real-time translation services.</li>
                <li>Anonymize data before processing by AI services.</li>
                <li>Monitor and analyze usage and trends to improve your experience with the Application.</li>
                <li>Track consultation duration for record-keeping purposes.</li>
                <li>Ensure the security of our Application.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-headline mb-2">4. Data Anonymization and Deletion</h2>
              <p>Patient-identifiable information (names, dates of birth) is anonymized before being sent to AI translation services. All transcripts and consultation-specific data are automatically deleted after each consultation session. We do not retain patient consultation data.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-headline mb-2">5. Disclosure of Your Information</h2>
              <p>We do not share your personally identifiable information with third parties except as necessary to provide the service (e.g., to AI translation service providers, after anonymization) or as required by law.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-headline mb-2">6. Security of Your Information</h2>
              <p>We use administrative, technical, and physical security measures to help protect your information. While we have taken reasonable steps to secure the information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-headline mb-2">7. Contact Us</h2>
              <p>If you have questions or comments about this Privacy Policy, please contact us at: [Contact Email/Link]</p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
