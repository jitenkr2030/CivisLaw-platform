import '../styles/globals.css';
import LayoutWrapper from '../components/LayoutWrapper';

export const metadata = {
  title: 'CivisLaw - Understanding Justice',
  description: 'Bridging the gap between the judicial system and citizens through clear, human-understandable explanations.',
  keywords: 'legal, court, justice, understanding, citizen, help, court processes, legal terms',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4A7C59" />
        <meta name="description" content={metadata.description} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;600;700&display=swap" rel="stylesheet" />
        <title>{metadata.title}</title>
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
