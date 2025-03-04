import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StructuredData } from "@/components/seo/structured-data";
import { generateWebsiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: 'About Formula 2 Analytics',
  description: 'Learn about Formula 2 Analytics, our mission to provide comprehensive F2 racing statistics, and the team behind the platform.',
  openGraph: {
    title: 'About Formula 2 Analytics',
    description: 'Discover the story behind Formula 2 Analytics and our passion for F2 racing statistics.',
  }
};

export default function About() {
  return (
    <>
      <StructuredData data={generateWebsiteSchema()} />
      <div className="container mx-auto px-4 py-6">
        <Card className="chart-card h-auto mb-8 max-w-[900px] mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to my Formula 2 Analytics page</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-8 text-center">
              <div>
                <p className="text-muted-foreground">
                  My name is Ben, and I am currently a university student. This website is my independent project for one of my units.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Project Motivation</h3>
                <p className="text-muted-foreground">
                  I have recently been interested about the Formula motorsports, and I wanted to create a platform that provides 
                  detailed analytics for the Formula 2 series. This project is the result of my interest in both data analysis 
                  and Formula motorsports.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Project Details</h3>
                <p className="text-muted-foreground">
                  Creating this website was very challenging. Given the limited time frame I had to work with, some aspects of 
                  the website may not be as polished as those on professional websites. However, I have dedicated a significant 
                  amount of time and effort to ensure that the content is informative and engaging.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Enjoy the Experience</h3>
                <p className="text-muted-foreground">
                  I hope you find the analytics and insights provided here useful and enjoyable. Your feedback and support are 
                  greatly appreciated as they help me learn and improve my skills.
                </p>
              </div>

              <div>
                <p className="text-muted-foreground font-medium">Thank you for visiting!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}