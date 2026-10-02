import React from "react";

import { Link } from "react-router-dom";

import "./LegalPage.css";



const LAST_UPDATED = "October 2, 2026";



const sections = {

  privacy: {
    title: "Privacy Policy",
    intro:
      "North Horizon Studios Private Limited (“North Horizon Studios”, “we”, “us”, or “our”) respects your privacy. This Privacy Policy explains how information may be collected, used, stored, and shared when you visit the North Horizon Studios website, play our browser games, use our Arcade, or use our mobile applications, including Pupscape - Dog Puzzle and Memory Tiles.",

    content: [
      {
        heading: "1. Information We May Process",
        paragraphs: [
          "We aim to collect and process only information that is reasonably necessary to operate, secure, improve, and support our website, games, mobile applications, and related services.",
          "Depending on how you use our services, the following types of information may be processed.",
          "If you contact us or otherwise voluntarily provide information to us, this may include your name, email address, the contents of messages or enquiries you submit, and other information you voluntarily provide to us.",
          "Our mobile games, including Pupscape - Dog Puzzle, do not require you to create an account or provide your name or email address in order to play.",
          "When you visit our website, certain technical information may be processed automatically by your browser, hosting provider, security systems, analytics services, or other third-party services. This may include IP address, browser type and version, device type, operating system, approximate location derived from IP address, referring or exit pages, date and time of requests, information about requests made to our website, and technical or diagnostic information.",
          "Our browser games may store gameplay information such as high scores, settings, and game progress locally on your device through browser storage or similar technologies. This information is generally stored on your device rather than transmitted to us.",
          "Our mobile applications, including Pupscape - Dog Puzzle and Memory Tiles, may store game progress, unlocked levels, settings, high scores, gameplay preferences, and other information required to provide game functionality locally on your device.",
          "When third-party services are used within our mobile applications, those services may process certain technical or device-related information as described in the relevant sections of this Privacy Policy and in the privacy policies of those third-party providers."
        ]
      },

      {
        heading: "2. How We Use Information",
        paragraphs: [
          "We may use information to operate and maintain our website, games, and mobile applications; save and provide gameplay functionality; respond to enquiries and support requests; protect our services and users from abuse, fraud, and security threats; diagnose technical problems; improve performance and functionality; understand how our services are used; provide and support advertising; comply with applicable laws and legal obligations; and protect our rights, property, and services.",
          "Gameplay information stored locally on your device may be used by our games to provide features such as saving progress, maintaining settings, and displaying high scores.",
          "We do not sell your personal information as a standalone product."
        ]
      },

      {
        heading: "3. Advertising and Google AdMob",
        paragraphs: [
          "Some of our games and applications display advertising.",
          "Pupscape - Dog Puzzle and Memory Tiles uses Google AdMob, a mobile advertising service provided by Google, to display advertisements. This includes banner advertisements, interstitial advertisements, and rewarded advertisements.",
          "Google AdMob and Google’s advertising partners may automatically process certain information when advertisements are displayed or interacted with. Depending on the applicable advertising configuration, region, device settings, and user choices, this information may include IP address, device information, device or advertising identifiers, information about the application and device, information about interactions with advertisements, advertising and usage information, diagnostic and performance information, and approximate location information derived from IP address or other technical information.",
          "This information may be used for purposes including delivering advertisements, measuring advertising performance, personalizing advertisements where permitted, limiting or controlling advertising frequency, preventing fraud and abuse, detecting invalid advertising activity, providing and improving advertising services, and generating aggregated advertising and performance information.",
          "The information processed by Google and its advertising partners may be governed by their respective privacy policies, terms, and applicable privacy controls.",
          "For more information about how Google processes information when advertising services are used, please review Google's applicable privacy information and advertising policies.",
          "Google Privacy Policy: https://policies.google.com/privacy",
          "You may also be able to manage advertising and privacy preferences through your device, operating system, browser, or Google's available privacy controls.",
          "Depending on your location and applicable law, advertising providers may request consent before certain types of data are processed for personalized advertising or other purposes. Where required, applicable consent mechanisms and privacy choices may be provided through the application or advertising provider."
        ]
      },

      {
        heading: "4. Third-Party Services",
        paragraphs: [
          "Our website, games, and mobile applications may use third-party services to provide functionality, security, hosting, advertising, analytics, or other technical services.",
          "For mobile applications that use Google AdMob, Google and its advertising partners may process information directly through the advertising SDK integrated into the application.",
          "Third-party providers may process information according to their own privacy policies, terms, and applicable laws.",
          "We do not control the privacy practices of third-party providers and recommend reviewing their respective privacy policies for additional information."
        ]
      },

      {
        heading: "5. Cookies and Similar Technologies",
        paragraphs: [
          "Our website may use cookies and similar technologies for purposes such as website functionality, security, preferences, measurement, advertising, and performance or technical operations.",
          "Some cookies may be placed by third-party services used on our website.",
          "Our browser games may use local storage or similar technologies to save information such as high scores, settings, game progress, and gameplay preferences.",
          "Our mobile applications may use device storage or similar technologies to save gameplay information, settings, and progress directly on the device.",
          "You can manage or block cookies through your browser settings. Blocking certain cookies may affect the functionality or availability of some website features."
        ]
      },

      {
        heading: "6. Data Sharing",
        paragraphs: [
          "We may share or permit access to information with service providers that help us host, secure, maintain, operate, analyze, or advertise on our website, games, and mobile applications where necessary for those services.",
          "For applications using advertising services, information may be processed directly by advertising providers such as Google and its advertising partners in accordance with their own policies and terms.",
          "We may also disclose information where reasonably necessary to comply with applicable law, respond to lawful requests from authorities, protect our rights or property, protect the safety of users, investigate fraud or security incidents, or enforce our terms and policies.",
          "We do not authorize third parties to use information received from us for purposes unrelated to the services they provide, except where permitted or required by applicable law."
        ]
      },

      {
        heading: "7. Data Retention",
        paragraphs: [
          "We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, including providing services, resolving disputes, maintaining security, complying with legal obligations, and protecting our rights.",
          "Information stored locally by our browser games generally remains on the user's device until it is cleared by the user, the browser, or the game.",
          "Information stored locally by a mobile application, such as gameplay progress, settings, or high scores, generally remains on the user's device until the application or its data is removed, cleared, reset, or overwritten by the user or the operating system.",
          "North Horizon Studios does not generally receive or store locally saved gameplay progress from Pupscape - Dog Puzzle on its own servers.",
          "Third-party providers, including advertising providers, may retain information according to their own privacy policies, retention practices, and legal obligations."
        ]
      },

      {
        heading: "8. Your Choices and Privacy Rights",
        paragraphs: [
          "Depending on your location and applicable law, you may have rights relating to your personal information. These may include, where applicable, the right to request access to personal information, request correction of inaccurate information, request deletion of personal information, withdraw consent where processing is based on consent, object to certain processing, restrict certain processing, and lodge a complaint with an applicable data protection authority.",
          "You may also have privacy and advertising controls provided by your device, operating system, web browser, Google account, or advertising provider.",
          "Because Pupscape - Dog Puzzle primarily stores gameplay information locally on your device, you can generally remove that local information by uninstalling the application or clearing its application data through your device settings.",
          "For privacy-related requests concerning information handled by North Horizon Studios, please contact us through the Contact page on our website and clearly state that your request concerns privacy or personal information. We may need to verify your identity before fulfilling certain requests where required by applicable law."
        ]
      },

      {
        heading: "9. Children's Privacy",
        paragraphs: [
          "Our website, games, and mobile applications are not intended to knowingly collect personal information from children in violation of applicable law.",
          "Our mobile games, including Pupscape - Dog Puzzle, do not require users to create an account or provide their name, email address, or other direct identifying information to play.",
          "If you believe that a child has provided personal information to North Horizon Studios in a manner that should not have occurred, please contact us so that we can investigate and take appropriate action.",
          "Where third-party advertising services are used, their applicable policies and safeguards concerning children and advertising also apply."
        ]
      },

      {
        heading: "10. Security",
        paragraphs: [
          "We use reasonable technical and organizational measures appropriate to the nature of the information we handle to help protect information against unauthorized access, alteration, disclosure, or destruction.",
          "However, no internet transmission, application, storage system, or electronic communication can be guaranteed to be completely secure."
        ]
      },

      {
        heading: "11. Third-Party Links and Services",
        paragraphs: [
          "Our website, games, and mobile applications may contain or use third-party services, websites, advertising providers, or other external services.",
          "Third-party services may have their own privacy policies and terms. We do not control and are not responsible for the privacy practices, content, security, or availability of third-party services.",
          "For services provided by Google, including Google AdMob, you should review Google's applicable privacy information and policies for additional details about how Google processes information."
        ]
      },

      {
        heading: "12. International Data Processing",
        paragraphs: [
          "North Horizon Studios and the third-party service providers we use may process information in countries other than the country in which you live.",
          "Where required by applicable law, appropriate safeguards or other lawful mechanisms may be used for international transfers of personal information.",
          "Third-party providers may process information according to their own privacy policies and applicable legal requirements."
        ]
      },

      {
        heading: "13. Changes to This Privacy Policy",
        paragraphs: [
          "We may update this Privacy Policy from time to time to reflect changes to our website, games and applications, advertising services, third-party services, data practices, or applicable laws and regulations.",
          "When we make changes, we will update the “Last updated” date at the top of this Privacy Policy. We encourage users to review this page periodically for the latest information about our privacy practices."
        ]
      },

      {
        heading: "14. Contact",
        paragraphs: [
          "North Horizon Studios Private Limited is the operator of this website and the developer and publisher of its games and applications.",
          "For privacy questions, requests, or concerns, please contact North Horizon Studios through the Contact page on our website. When contacting us about personal data, please clearly indicate that your request concerns privacy or personal information so that we can route your request appropriately."
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

    \<main className="legal-page">

      \<div className="legal-shell">

        \<Link to="/" className="legal-back">

          ← Back to North Horizon Studios

        \</Link>



        \<header className="legal-header">

          \<p className="legal-eyebrow">NORTH HORIZON STUDIOS\</p>

          \<h1>{page.title}\</h1>

          \<p className="legal-updated">Last updated: {LAST_UPDATED}\</p>

        \</header>



        \<div className="legal-content">

          \<p className="legal-intro">{page.intro}\</p>



          {page.content.map((section) => (

            \<section className="legal-section" key={section.heading}>

              \<h2>{section.heading}\</h2>



              {section.paragraphs.map((paragraph) => (

                \<p key={paragraph}>{paragraph}\</p>

              ))}

            \</section>

          ))}

        \</div>



        \<div className="legal-footer-links">

          \<Link to="/privacy-policy">Privacy Policy\</Link>

          \<Link to="/terms">Terms of Use\</Link>

          \<Link to="/cookie-policy">Cookie Policy\</Link>

        \</div>

      \</div>

    \</main>

  );

}