import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
            <CardTitle className="text-3xl font-headline text-primary">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground/90">
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-xl font-semibold font-headline mb-2">1. Agreement to Terms</h2>
              <p>By accessing or using the MediSpeak application ("Application"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Application. These Terms apply to all users of the Application.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-headline mb-2">2. Use of the Application</h2>
              <p>MediSpeak provides a platform for multilingual medical consultations. You agree to use the Application only for its intended purposes and in accordance with all applicable laws and regulations.</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>You are responsible for maintaining the confidentiality of your account and password.</li>
                <li>You agree not to misuse the Application, including but not limited to, attempting to gain unauthorized access, transmitting harmful code, or disrupting the service.</li>
                <li>The Application relies on AI for translation and anonymization. While we strive for accuracy, we cannot guarantee perfection. Users should exercise professional judgment when relying on translations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-headline mb-2">3. Data Handling</h2>
              <p>Please refer to our Privacy Policy for information on how we collect, use, and protect your data. Key points include real-time processing, data anonymization, and automatic deletion of transcripts post-consultation.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold font-headline mb-2">4. Intellectual Property</h2>
              <p>The Application and its original content, features, and functionality are and will remain the exclusive property of MediSpeak and its licensors. The Application is protected by copyright, trademark, and other laws of both [Your Country/Jurisdiction] and foreign countries.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-headline mb-2">5. Disclaimer of Warranties</h2>
              <p>The Application is provided on an "AS IS" and "AS AVAILABLE" basis. MediSpeak makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            </section>

             <section>
              <h2 className="text-xl font-semibold font-headline mb-2">6. Limitation of Liability</h2>
              <p>In no event shall MediSpeak or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Application, even if MediSpeak or a MediSpeak authorized representative has been notified orally or in writing of the possibility of such damage.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-headline mb-2">7. Changes to Terms</h2>
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-headline mb-2">8. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us at: [Contact Email/Link]</p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
