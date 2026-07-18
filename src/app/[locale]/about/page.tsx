import Link from 'next/link'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bleach-mirrors-high.wiki'
  const path = '/about'

  return {
    title: 'About BLEACH Mirrors High Wiki - Your Ultimate Bleach Anime & Manga Resource',
    description: 'Learn about BLEACH Mirrors High Wiki, a community-driven resource hub providing comprehensive character guides, arc analysis, Zanpakuto references, and strategies for exploring the Bleach anime and manga.',
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`,
      siteName: 'BLEACH Mirrors High Wiki',
      title: 'About BLEACH Mirrors High Wiki',
      description: 'Learn about our mission to provide the best Bleach anime and manga resources and guides.',
      images: [
        {
          url: `${siteUrl}/images/hero.webp`,
          width: 1200,
          height: 630,
          alt: 'BLEACH Mirrors High Wiki',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About BLEACH Mirrors High Wiki',
      description: 'Learn about our mission to provide the best Bleach anime and manga resources.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About BLEACH Mirrors High Wiki
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            Your community-driven resource center for Bleach
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Welcome to BLEACH Mirrors High Wiki</h2>
            <p>
              BLEACH Mirrors High Wiki is an <strong>unofficial, fan-made resource website</strong> dedicated to helping fans
              master the Bleach anime and manga. We are a community-driven platform that provides comprehensive guides,
              character profiles, Zanpakuto details, arc analysis, and strategic insights to enhance your Bleach experience.
            </p>
            <p>
              Whether you're a new fan just starting your Bleach journey or a seasoned veteran looking to dive deeper into the lore,
              BLEACH Mirrors High Wiki is here to support you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Our Mission</h2>
            <p>
              Our mission is simple: <strong>to empower Bleach fans with accurate, up-to-date information
              and useful references</strong> that help them explore the series. We strive to:
            </p>
            <ul>
              <li><strong>Provide reliable information:</strong> Keep our content updated with the latest manga chapters, new anime episodes, and character developments</li>
              <li><strong>Build useful tools:</strong> Develop guides, reference lists, and analyses that help fans navigate the Bleach universe</li>
              <li><strong>Foster community:</strong> Create a welcoming space where fans can learn, share theories, and grow together</li>
              <li><strong>Stay accessible:</strong> Keep all resources free and easy to use for fans of all levels</li>
            </ul>

            <h2>Our Vision</h2>
            <p>
              We envision BLEACH Mirrors High Wiki as the <strong>go-to destination</strong> for every Bleach fan seeking
              to dive deeper into the series. We want to be the resource that fans trust and rely on, whether they need
              character guides, want to revisit story arcs, or are looking for detailed battle analysis.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature Card 1 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">📖</div>
              <h3 className="text-xl font-semibold text-white mb-2">Character Guides</h3>
              <p className="text-slate-300">
                Comprehensive profiles for Ichigo, Rukia, Aizen, and the full Bleach cast.
                Get to know every Soul Reaper, Hollow, and human!
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Arc Breakdowns</h3>
              <p className="text-slate-300">
                Detailed guides on every story arc, from Soul Society to the Thousand-Year Blood War.
                Follow the complete storyline beat by beat.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🗡️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Zanpakuto Guide</h3>
              <p className="text-slate-300">
                Complete reference for every Zanpakuto, including Shikai, Bankai, wielders, and abilities.
                Master the weapons of the Soul Reapers.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">⚔️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Battle Analysis</h3>
              <p className="text-slate-300">
                Breakdowns of the biggest fights, power escalations, and key turning points.
                Relive the most iconic clashes in the series.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">👻</div>
              <h3 className="text-xl font-semibold text-white mb-2">Hollows & Factions</h3>
              <p className="text-slate-300">
                Guides to the Espada, Gotei 13 Captains, Quincy, and other factions.
                Understand the powers at war across every world.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Multilingual Support</h3>
              <p className="text-slate-300">
                Content available in multiple languages including English, Russian, Portuguese,
                German, Spanish, Japanese, Korean, and French.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Community-Driven</h2>
            <p>
              BLEACH Mirrors High Wiki is built <strong>by the community, for the community</strong>. We welcome contributions,
              feedback, and suggestions from fans of all levels. Our content is constantly evolving based on:
            </p>
            <ul>
              <li><strong>Fan feedback:</strong> Your suggestions help us improve and expand our resources</li>
              <li><strong>Community discoveries:</strong> New theories, hidden details, and insights shared by fans</li>
              <li><strong>New releases:</strong> We track new anime episodes and manga chapters and update our content accordingly</li>
              <li><strong>Power scaling:</strong> We track battle outcomes and power rankings based on the latest story developments</li>
            </ul>
            <p>
              <strong>Want to contribute?</strong> Whether you've spotted a new character detail, found a hidden lore connection,
              or have suggestions for new guides, we'd love to hear from you! Reach out through our contact channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>About the Team</h2>
            <p>
              BLEACH Mirrors High Wiki is maintained by a dedicated team of passionate fans and writers who love
              Bleach as much as you do. We're fans first, constantly re-reading the manga, re-watching the anime,
              and staying updated with the latest news.
            </p>
            <p>
              Our team combines expertise in:
            </p>
            <ul>
              <li><strong>Lore analysis:</strong> Deep understanding of Bleach characters, arcs, and power systems</li>
              <li><strong>Web development:</strong> Building fast, user-friendly tools and interfaces</li>
              <li><strong>Content creation:</strong> Writing clear, helpful guides and tutorials</li>
              <li><strong>Community management:</strong> Listening to fan feedback and fostering a positive environment</li>
            </ul>
            <p className="text-slate-400 italic text-sm">
              Project Codename: "Dreamscape" – Navigating the surreal together.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Important Disclaimer</h2>
            <p className="text-yellow-400/90">
              <strong>BLEACH Mirrors High Wiki is an unofficial fan-made website.</strong> We are NOT affiliated with,
              endorsed by, or associated with the creators of Bleach or any official entities.
            </p>
            <p>
              All series content, trademarks, characters, and assets are the property of their respective owners.
              We use series-related content under fair use principles for informational and educational purposes only.
            </p>
            <p>
              BLEACH Mirrors High Wiki is a non-profit, community resource created by fans, for fans.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Get in Touch</h2>
            <p>
              We'd love to hear from you! Whether you have questions, suggestions, found a bug, or just want to say hi:
            </p>
            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">General Inquiries</h3>
                <a href="mailto:contact@bleach-mirrors-high.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  contact@bleach-mirrors-high.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Bug Reports</h3>
                <a href="mailto:support@bleach-mirrors-high.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  support@bleach-mirrors-high.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Content Submissions</h3>
                <a href="mailto:contribute@bleach-mirrors-high.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  contribute@bleach-mirrors-high.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Partnerships</h3>
                <a href="mailto:partnerships@bleach-mirrors-high.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  partnerships@bleach-mirrors-high.wiki
                </a>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              <strong>Response Time:</strong> We aim to respond to all inquiries within 2-3 business days.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-y border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Stay updated with the latest guides, tips, and Bleach news.
            Bookmark this site and check back regularly for new content!
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[hsl(var(--nav-theme-light))] text-white font-semibold hover:opacity-90 transition"
          >
            Explore Resources
          </Link>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Link href="/" className="text-[hsl(var(--nav-theme-light))] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}
