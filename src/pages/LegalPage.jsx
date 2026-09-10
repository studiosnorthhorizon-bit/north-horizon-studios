import React from "react";
import { Link } from "react-router-dom";
import "./LegalPage.css";

const LAST_UPDATED = "September 7, 2026";

const sections = {
  privacy: {
    title: "Privacy Policy",
    intro:
      "North Horizon Studios Private Limited (“North Horizon Studios”, “we”, “us”, or “our”) respects your privacy. This Privacy Policy explains what information may be processed when you visit the North Horizon Studios website, play our browser games, use our Arcade, or contact us.",
    content: [
      {
        heading: "1. Information We May Process",
        paragraphs: [
          "We aim to collect only information that is reasonably necessary to operate, secure, improve, and communicate about our website and services.",
          "Depending on how you use the site, this may include information you choose to provide to us, such as your name, email address, and the contents of a message submitted through our contact channels.",
          "Technical information may also be processed automatically by your browser, hosting provider, security systems, or third party services. This can include IP address, browser type, device type, operating system, approximate location derived from IP address, referring pages, and information about requests made to our website.",
          "Our browser games may store gameplay information such as high scores, settings, or game progress locally on your device using browser storage. This information is generally stored on your device rather than transmitted to us."
        ]
      },
      {
        heading: "2. How We Use Information",
        paragraphs: [
          "We may use information to operate and maintain the website and games; respond to enquiries; protect the website and users from abuse, fraud, and security threats; understand technical problems and improve performance; comply with applicable law; and support advertising on pages where advertising is enabled.",
          "We do not sell your personal information as a standalone product."
        ]
      },
      {
        heading: "3. Advertising and Third Party Services",
        paragraphs: [
          "Advertising may be displayed on our Arcade and individual game pages. When advertising is enabled, third party advertising providers, including Google and its partners, may use cookies, device identifiers, IP addresses, or similar technologies to serve, measure, limit, or personalize advertising, subject to their own policies and the choices available to users.",
          "Google requires publishers using its advertising products to disclose relevant data collection and the use of cookies or similar technologies. For more information about how Google uses data when you use partner sites or apps, please review Google's published privacy information.",
          "We do not control the privacy practices of third party providers. Their processing is governed by their own privacy policies and terms."
        ]
      },
      {
        heading: "4. Cookies and Similar Technologies",
        paragraphs: [
          "We may use cookies and similar technologies that are necessary for website operation, security, preferences, measurement, or advertising. Some cookies may be placed by third party services used on the website.",
          "You can manage or block cookies through your browser settings. Blocking some cookies may affect the availability or functionality of certain features."
        ]
      },
      {
        heading: "5. Data Sharing",
        paragraphs: [
          "We may share information with service providers that help us host, secure, operate, maintain, or advertise on the website, where necessary for those services. We may also disclose information where required by law, legal process, or to protect our rights, users, or the security of our services.",
          "We do not authorize third parties to use information received from us for purposes unrelated to the services they provide, except where permitted or required by applicable law."
        ]
      },
      {
        heading: "6. Data Retention",
        paragraphs: [
          "We retain personal information only for as long as reasonably necessary for the purpose for which it was collected, to provide services, resolve disputes, maintain security, meet legal obligations, or otherwise as permitted by applicable law.",
          "Information stored locally by a browser game, such as a high score, remains on the user's device until it is cleared by the user, the browser, or the game."
        ]
      },
      {
        heading: "7. Your Choices and Rights",
        paragraphs: [
          "Depending on applicable law, you may have rights relating to your personal data, including rights to request access to or correction of personal information, withdraw consent where processing is based on consent, request deletion where applicable, and raise a complaint about our handling of personal data.",
          "To make a privacy related request, please use our Contact page and clearly state that your request concerns privacy or personal data. We may need to verify the request before taking action."
        ]
      },
      {
        heading: "8. Children's Privacy",
        paragraphs: [
          "Our website and games are not intended to knowingly collect personal information from children in violation of applicable law. If you believe a child has provided personal information to us in a way that should not have occurred, please contact us so that we can review the situation."
        ]
      },
      {
        heading: "9. Security",
        paragraphs: [
          "We use reasonable technical and organizational measures appropriate to the nature of the information we handle. However, no internet transmission or storage system can be guaranteed to be completely secure."
        ]
      },
      {
        heading: "10. Changes to This Policy",
        paragraphs: [
          "We may update this Privacy Policy from time to time to reflect changes to our website, services, advertising arrangements, or legal requirements. The updated version will be posted on this page with a revised “Last updated” date."
        ]
      },
      {
        heading: "11. Contact",
        paragraphs: [
          "North Horizon Studios Private Limited is the operator of this website. For privacy questions or requests, please contact us through the Contact page on this website."
        ]
      }
    ]
  },

  terms: {
    title: "Terms of Use",
    intro:
      "These Terms of Use (“Terms”) govern your access to and use of the North Horizon Studios website, Arcade, browser games, and related content operated by North Horizon Studios Private Limited (“North Horizon Studios”, “we”, “us”, or “our”). By using the website, you agree to these Terms.",
    content: [
      {
        heading: "1. Use of the Website",
        paragraphs: [
          "You may use our website and browser games for lawful personal and non commercial purposes, subject to these Terms and applicable law.",
          "You agree not to interfere with the operation or security of the website, attempt to gain unauthorized access to systems or accounts, introduce malicious code, abuse advertising or reward systems, scrape or systematically copy site content without permission, or use our services for unlawful purposes."
        ]
      },
      {
        heading: "2. Games and Arcade",
        paragraphs: [
          "Our browser games are provided for entertainment. Game mechanics, scores, availability, features, difficulty, and other gameplay elements may change without notice.",
          "Scores and gameplay data may be stored locally in your browser. Unless a feature specifically states otherwise, local scores are not a promise of a permanent leaderboard, ranking, prize, or account record.",
          "We may temporarily suspend or remove a game for maintenance, security, technical reasons, or other operational reasons."
        ]
      },
      {
        heading: "3. Advertising and Rewards",
        paragraphs: [
          "Advertising may appear on the Arcade and individual game pages. We may use third party advertising services, including Google advertising products.",
          "Some games may offer optional rewarded ad features, such as continuing a run after game over. Reward availability, eligibility, frequency, and behavior may change as advertising integrations are updated.",
          "You must not manipulate, automate, fraudulently interact with, or otherwise abuse advertisements or rewarded features."
        ]
      },
      {
        heading: "4. Intellectual Property",
        paragraphs: [
          "Unless otherwise stated, the North Horizon Studios name, branding, website design, game concepts and implementations, original artwork, graphics, text, logos, and other original content made available through this website are owned by or licensed to North Horizon Studios.",
          "You may not reproduce, redistribute, sell, modify, publicly display for commercial purposes, or create derivative works from our proprietary content without our prior written permission, except where permitted by applicable law."
        ]
      },
      {
        heading: "5. Third Party Content and Links",
        paragraphs: [
          "The website may contain links to third party websites, services, advertising providers, or social platforms. We do not control and are not responsible for third party content, availability, security, or privacy practices.",
          "Your use of third party services is subject to the terms and policies of those providers."
        ]
      },
      {
        heading: "6. Availability and Disclaimers",
        paragraphs: [
          "The website and games are provided on an “as is” and “as available” basis to the extent permitted by law. We do not guarantee that the website, games, or any particular feature will always be available, uninterrupted, error free, or compatible with every device or browser.",
          "We may modify, suspend, or discontinue any part of the website or games at any time."
        ]
      },
      {
        heading: "7. Limitation of Liability",
        paragraphs: [
          "To the maximum extent permitted by applicable law, North Horizon Studios will not be liable for indirect, incidental, special, consequential, or punitive damages arising from or related to your use of the website or games.",
          "Nothing in these Terms excludes or limits liability that cannot lawfully be excluded or limited under applicable law."
        ]
      },
      {
        heading: "8. Indemnity",
        paragraphs: [
          "To the extent permitted by applicable law, you agree to be responsible for losses or claims arising from your unlawful use of the website, your violation of these Terms, or your infringement of another person's rights."
        ]
      },
      {
        heading: "9. Changes to These Terms",
        paragraphs: [
          "We may update these Terms from time to time. Changes become effective when the revised Terms are posted on this page, unless a different effective date is stated."
        ]
      },
      {
        heading: "10. Governing Law",
        paragraphs: [
          "These Terms are governed by the laws applicable in India, without prejudice to any mandatory consumer or other rights that apply to you under the laws of your jurisdiction."
        ]
      },
      {
        heading: "11. Contact",
        paragraphs: [
          "For questions about these Terms, please contact North Horizon Studios Private Limited through the Contact page on this website."
        ]
      }
    ]
  },

  cookies: {
    title: "Cookie Policy",
    intro:
      "This Cookie Policy explains how North Horizon Studios Private Limited (“North Horizon Studios”, “we”, “us”, or “our”) may use cookies and similar technologies on the North Horizon Studios website, Arcade, and browser games.",
    content: [
      {
        heading: "1. What Are Cookies",
        paragraphs: [
          "Cookies are small files or pieces of information stored in your browser or device. Similar technologies, such as local storage, may also be used to remember information or support website functionality."
        ]
      },
      {
        heading: "2. How We Use Cookies and Similar Technologies",
        paragraphs: [
          "We may use technologies for essential website functions, security, remembering preferences, understanding technical performance, and supporting advertising where advertising is enabled.",
          "Our browser games may also use local storage to save information such as high scores, settings, or other gameplay preferences. This local storage is different from a server side account and normally remains on your device."
        ]
      },
      {
        heading: "3. Advertising Cookies",
        paragraphs: [
          "Advertising may be displayed on our Arcade and individual game pages. When Google advertising services are enabled, Google and its partners may use cookies or similar technologies to serve and measure ads and, depending on applicable settings and user choices, personalize advertising.",
          "Google states that publishers using AdSense must disclose the use of advertising cookies and relevant third party technologies in their privacy policy.",
          "You can manage advertising personalization through the controls provided by Google and can also manage cookies through your browser settings."
        ]
      },
      {
        heading: "4. Types of Technologies We May Use",
        paragraphs: [
          "Essential technologies: used to support basic website operation, security, routing, or other functions necessary for the service.",
          "Preference technologies: used to remember settings or choices where applicable.",
          "Advertising technologies: used by advertising providers to deliver, measure, limit, or personalize advertising where advertising is enabled.",
          "Local game storage: used by our browser games to save gameplay information such as high scores and settings directly on your device."
        ]
      },
      {
        heading: "5. Managing Cookies",
        paragraphs: [
          "Most browsers allow you to view, delete, block, or restrict cookies through their settings. You can also clear local storage for this website through your browser's site data controls.",
          "If you block or delete certain technologies, some website or game features may not work as intended."
        ]
      },
      {
        heading: "6. Third Party Providers",
        paragraphs: [
          "Third party providers may place or access their own technologies when their services are used on our website. Their use of information is governed by their own policies, and we do not control those policies.",
          "For Google advertising services, please review Google's published information about how it uses cookies and data on partner sites."
        ]
      },
      {
        heading: "7. Changes to This Cookie Policy",
        paragraphs: [
          "We may update this Cookie Policy when our website, games, advertising services, or legal requirements change. The latest version will be posted on this page."
        ]
      },
      {
        heading: "8. Contact",
        paragraphs: [
          "If you have questions about our use of cookies or similar technologies, please contact North Horizon Studios Private Limited through the Contact page."
        ]
      }
    ]
  }
};

export default function LegalPage({ type = "privacy" }) {
  const page = sections[type] || sections.privacy;

  return (
    <main className="legal-page">
      <div className="legal-shell">
        <Link to="/" className="legal-back">
          ← Back to North Horizon Studios
        </Link>

        <header className="legal-header">
          <p className="legal-eyebrow">NORTH HORIZON STUDIOS</p>
          <h1>{page.title}</h1>
          <p className="legal-updated">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="legal-content">
          <p className="legal-intro">{page.intro}</p>

          {page.content.map((section) => (
            <section className="legal-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        <div className="legal-footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/cookie-policy">Cookie Policy</Link>
        </div>
      </div>
    </main>
  );
}
