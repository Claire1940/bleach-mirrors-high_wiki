"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Clapperboard,
  Flag,
  Route,
  Sparkles,
  Sword,
  Swords,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

// 模块小标题（eyebrow）：图标 + 标签文字，统一风格
function ModuleEyebrow({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5">
      <span className="text-[hsl(var(--nav-theme-light))]">{icon}</span>
      <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
        {label}
      </span>
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://bleach-mirrors-high.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "BLEACH Mirrors High Wiki",
        description:
          "Complete Bleach Wiki covering characters, Zanpakuto, story arcs, Soul Reapers, Hollows, abilities, battles, episodes, and manga from Tite Kubo's legendary series.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Bleach - Legendary Supernatural Shonen Anime",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "BLEACH Mirrors High Wiki",
        alternateName: "Bleach",
        url: siteUrl,
        description:
          "Complete Bleach Wiki resource hub for characters, Zanpakuto, story arcs, abilities, battles, episodes, and manga guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "BLEACH Mirrors High Wiki - Legendary Supernatural Shonen Anime",
        },
        sameAs: [
          "https://bleach-anime.com/",
          "https://www.viz.com/bleach",
          "https://www.reddit.com/r/bleach/",
          "https://x.com/BLEACHanimation",
        ],
      },
      {
        "@type": "TVSeries",
        name: "Bleach",
        genre: ["Action", "Adventure", "Supernatural", "Shonen"],
        numberOfSeasons: 16,
      },
      {
        "@type": "VideoObject",
        name: "BLEACH Thousand-Year Blood War PV",
        description:
          "Official BLEACH Thousand-Year Blood War anime promotional video from the BLEACH official anime channel.",
        uploadDate: "2022-09-01",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/Zg_wnf1X-tI",
        url: "https://www.youtube.com/watch?v=Zg_wnf1X-tI",
      },
    ],
  };

  // Abilities accordion state
  const [abilitiesExpanded, setAbilitiesExpanded] = useState<number | null>(
    null,
  );
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Tools Grid 卡片 → section ID 一一对应
  const sectionIds = [
    "characters",
    "zanpakuto",
    "arcs",
    "factions",
    "abilities",
    "battles",
    "episodes",
    "manga",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 scroll-reveal text-center">
            {/* Badge */}
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)]
                            bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5 md:mb-6 md:px-4 md:py-2"
            >
              <Sparkles className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-medium md:text-sm">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold leading-[1.05] sm:text-5xl md:mb-6 md:text-7xl">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("characters")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(var(--nav-theme))] px-6 py-3.5
                           font-semibold text-base text-white transition-colors hover:bg-[hsl(var(--nav-theme)/0.9)]
                           md:px-8 md:py-4 md:text-lg"
              >
                <BookOpen className="h-5 w-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://bleach-anime.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3.5
                           font-semibold text-base transition-colors hover:bg-white/10 md:px-8 md:py-4 md:text-lg"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section — 进入视口自动播放（IntersectionObserver），点击播放按钮为后备 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="Zg_wnf1X-tI"
              title="BLEACH Thousand-Year Blood War PV"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（导航区，位于视频区之后） */}
      <section className="bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="scroll-reveal mb-8 text-center md:mb-12">
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = sectionIds[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group cursor-pointer rounded-xl border border-border bg-card p-4 text-left
                             transition-all duration-300 hover:border-[hsl(var(--nav-theme)/0.5)]
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] md:p-6"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]
                                transition-colors group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                md:mb-4 md:h-12 md:w-12"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 text-[hsl(var(--nav-theme-light))] md:h-6 md:w-6"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold leading-snug md:text-base">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Characters */}
      <section id="characters" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="scroll-reveal mb-8 text-center md:mb-12">
            <ModuleEyebrow icon={<Users className="h-4 w-4" />} label={t.modules.bleachCharacters.eyebrow} />
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              <LinkedTitle linkData={moduleLinkMap["bleachCharacters"]} locale={locale}>
                {t.modules.bleachCharacters.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.bleachCharacters.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.modules.bleachCharacters.items.map((c: any, index: number) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)]"
              >
                <h3 className="mb-2 text-lg font-bold">{c.name}</h3>
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-[hsl(var(--nav-theme)/0.4)] bg-[hsl(var(--nav-theme)/0.15)] px-2 py-0.5 text-xs font-medium text-[hsl(var(--nav-theme-light))]">
                    {c.role}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">
                    {c.affiliation}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Zanpakuto */}
      <section id="zanpakuto" className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="scroll-reveal mb-8 text-center md:mb-12">
            <ModuleEyebrow icon={<Sword className="h-4 w-4" />} label={t.modules.bleachZanpakuto.eyebrow} />
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              <LinkedTitle linkData={moduleLinkMap["bleachZanpakuto"]} locale={locale}>
                {t.modules.bleachZanpakuto.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.bleachZanpakuto.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.modules.bleachZanpakuto.items.map((z: any, index: number) => (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)]"
              >
                <h3 className="mb-1 text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                  {z.name}
                </h3>
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Sword className="h-3.5 w-3.5 text-[hsl(var(--nav-theme-light))]" />
                  <span>Wielded by {z.wielder}</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Shikai
                    </p>
                    <p className="leading-relaxed text-foreground/80">{z.shikai}</p>
                  </div>
                  <div>
                    <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Bankai
                    </p>
                    <p className="leading-relaxed text-foreground/80">{z.bankai}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Arcs (numbered timeline) */}
      <section id="arcs" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="scroll-reveal mb-8 text-center md:mb-12">
            <ModuleEyebrow icon={<Route className="h-4 w-4" />} label={t.modules.bleachArcs.eyebrow} />
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              <LinkedTitle linkData={moduleLinkMap["bleachArcs"]} locale={locale}>
                {t.modules.bleachArcs.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.bleachArcs.intro}
            </p>
          </div>

          <div className="scroll-reveal relative space-y-3 border-l-2 border-[hsl(var(--nav-theme)/0.3)] pl-6 md:space-y-4 md:pl-8">
            {t.modules.bleachArcs.steps.map((step: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.65rem] flex h-8 w-8 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)] md:-left-[2.15rem] md:h-9 md:w-9">
                  <span className="text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-white/5 p-4 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-6">
                  <h3 className="mb-1.5 text-lg font-bold md:text-xl">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 中部停顿 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 4: Factions */}
      <section id="factions" className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="scroll-reveal mb-8 text-center md:mb-12">
            <ModuleEyebrow icon={<Flag className="h-4 w-4" />} label={t.modules.bleachFactions.eyebrow} />
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              <LinkedTitle linkData={moduleLinkMap["bleachFactions"]} locale={locale}>
                {t.modules.bleachFactions.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.bleachFactions.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.modules.bleachFactions.items.map((f: any, index: number) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)]"
              >
                <h3 className="mb-2 text-lg font-bold">{f.name}</h3>
                <div className="mb-3 flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center rounded-full border border-[hsl(var(--nav-theme)/0.4)] bg-[hsl(var(--nav-theme)/0.15)] px-2 py-0.5 font-medium text-[hsl(var(--nav-theme-light))]">
                    <Flag className="mr-1 h-3 w-3" />
                    Leader: {f.leader}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Abilities (accordion) */}
      <section id="abilities" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="scroll-reveal mb-8 text-center md:mb-12">
            <ModuleEyebrow icon={<Sparkles className="h-4 w-4" />} label={t.modules.bleachAbilities.eyebrow} />
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              <LinkedTitle linkData={moduleLinkMap["bleachAbilities"]} locale={locale}>
                {t.modules.bleachAbilities.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.bleachAbilities.intro}
            </p>
          </div>

          <div className="scroll-reveal mx-auto max-w-4xl space-y-2">
            {t.modules.bleachAbilities.items.map((a: any, index: number) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-border"
              >
                <button
                  onClick={() =>
                    setAbilitiesExpanded(abilitiesExpanded === index ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-white/5 md:p-5"
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-[hsl(var(--nav-theme)/0.4)] bg-[hsl(var(--nav-theme)/0.15)] px-2 py-0.5 text-xs font-medium text-[hsl(var(--nav-theme-light))]">
                      {a.type}
                    </span>
                    <span className="font-semibold md:text-lg">{a.name}</span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-300 ${abilitiesExpanded === index ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${abilitiesExpanded === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground md:px-5 md:pb-5">
                      {a.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 6: Battles */}
      <section id="battles" className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="scroll-reveal mb-8 text-center md:mb-12">
            <ModuleEyebrow icon={<Swords className="h-4 w-4" />} label={t.modules.bleachBattles.eyebrow} />
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              <LinkedTitle linkData={moduleLinkMap["bleachBattles"]} locale={locale}>
                {t.modules.bleachBattles.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.bleachBattles.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.modules.bleachBattles.items.map((b: any, index: number) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)]"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Swords className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                  <span className="inline-flex items-center rounded-full border border-[hsl(var(--nav-theme)/0.4)] bg-[hsl(var(--nav-theme)/0.15)] px-2 py-0.5 text-xs font-medium text-[hsl(var(--nav-theme-light))]">
                    {b.arc}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold">{b.name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Episodes (table) */}
      <section id="episodes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="scroll-reveal mb-8 text-center md:mb-12">
            <ModuleEyebrow icon={<Clapperboard className="h-4 w-4" />} label={t.modules.bleachEpisodes.eyebrow} />
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              <LinkedTitle linkData={moduleLinkMap["bleachEpisodes"]} locale={locale}>
                {t.modules.bleachEpisodes.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.bleachEpisodes.intro}
            </p>
          </div>

          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] text-muted-foreground">
                  <th className="p-3 font-semibold md:p-4">Arc</th>
                  <th className="p-3 font-semibold md:p-4">Episodes</th>
                  <th className="p-3 font-semibold md:p-4">Type</th>
                  <th className="p-3 font-semibold md:p-4">Summary</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.bleachEpisodes.items.map((e: any, index: number) => (
                  <tr
                    key={index}
                    className="border-t border-border align-top transition-colors hover:bg-white/5"
                  >
                    <td className="p-3 font-medium md:p-4">{e.arc}</td>
                    <td className="p-3 text-muted-foreground md:p-4">{e.episodes}</td>
                    <td className="p-3 md:p-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${e.type === "Filler" ? "border-border bg-white/5 text-muted-foreground" : "border-[hsl(var(--nav-theme)/0.4)] bg-[hsl(var(--nav-theme)/0.15)] text-[hsl(var(--nav-theme-light))]"}`}
                      >
                        {e.type}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground md:p-4">{e.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Module 8: Manga (table) */}
      <section id="manga" className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="scroll-reveal mb-8 text-center md:mb-12">
            <ModuleEyebrow icon={<BookOpen className="h-4 w-4" />} label={t.modules.bleachManga.eyebrow} />
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              <LinkedTitle linkData={moduleLinkMap["bleachManga"]} locale={locale}>
                {t.modules.bleachManga.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.bleachManga.intro}
            </p>
          </div>

          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] text-muted-foreground">
                  <th className="p-3 font-semibold md:p-4">Volume</th>
                  <th className="p-3 font-semibold md:p-4">Chapters</th>
                  <th className="p-3 font-semibold md:p-4">Arc</th>
                  <th className="p-3 font-semibold md:p-4">Summary</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.bleachManga.items.map((m: any, index: number) => (
                  <tr
                    key={index}
                    className="border-t border-border align-top transition-colors hover:bg-white/5"
                  >
                    <td className="p-3 font-medium md:p-4">{m.volume}</td>
                    <td className="p-3 text-muted-foreground md:p-4">{m.chapters}</td>
                    <td className="p-3 md:p-4">
                      <span className="inline-flex items-center rounded-full border border-[hsl(var(--nav-theme)/0.4)] bg-[hsl(var(--nav-theme)/0.15)] px-2 py-0.5 text-xs font-medium text-[hsl(var(--nav-theme-light))]">
                        {m.arc}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground md:p-4">{m.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 广告位 7: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Latest Updates Section（保留模板模块，内容为空时组件自动返回 null） */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner (final) */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="border-t border-border bg-white/[0.02]">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div>
              <h3 className="mb-4 text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="mb-4 font-semibold">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.reddit.com/r/bleach/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/BLEACHanimation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://bleach-anime.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.officialSite}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.viz.com/bleach"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.vizMedia}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="mb-4 font-semibold">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="mb-2 text-sm text-muted-foreground">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
