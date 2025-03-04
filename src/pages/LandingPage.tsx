import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RankedList } from "@/components/RankedList";
import { ContentBlock } from "@/components/ContentBlock";
import { Typewriter } from "@/components/ui/typewriter";
import { useCompanies } from "@/hooks/useCompanies";
import { useMunicipalities } from "@/hooks/useMunicipalities";
import { useTranslation } from "react-i18next";

export function LandingPage() {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("companies");
  const { companies } = useCompanies();
  const { getTopMunicipalities } = useMunicipalities();

  const companyTypewriterTexts = [
    t("landingPage.typewriter.company.reduceEmissions"),
    t("landingPage.typewriter.company.scope3Emissions"),
    t("landingPage.typewriter.company.meetParisAgreement"),
  ];

  const municipalityTypewriterTexts = [
    t("landingPage.typewriter.municipality.reduceEmissions"),
    t("landingPage.typewriter.municipality.meetParisAgreement"),
    t("landingPage.typewriter.municipality.climateActions"),
    t("landingPage.typewriter.municipality.climatePlans"),
  ];

  // Get top 5 companies by emissions reduction
  const topCompanies = companies
    .sort((a, b) => b.metrics.emissionsReduction - a.metrics.emissionsReduction)
    .slice(0, 5)
    .map((company) => ({
      id: company.wikidataId,
      name: company.name,
      value: company.metrics.emissionsReduction,
      displayValue: company.metrics.displayReduction,
    }));

  // Get top 5 municipalities by emissions reduction
  const topMunicipalities = getTopMunicipalities(5).map((municipality) => ({
    id: municipality.id,
    name: municipality.name,
    value: municipality.historicalEmissionChangePercent,
    displayValue: municipality.historicalEmissionChangePercent.toFixed(1),
  }));

  // Get municipality data for comparison
  // const municipalityComparisonData = getMunicipalitiesForMap(10).map(
  //   (municipality) => ({
  //     id: municipality.id,
  //     name: municipality.name,
  //     value: municipality.value,
  //     rank: "1",
  //     change: Math.random() > 0.5 ? 5.2 : -3.4, // Mock data - replace with real change values
  //   })
  // );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 md:py-24">
        <div className="mb-8 md:mb-12">
          <Tabs
            defaultValue="companies"
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full max-w-xs md:max-w-md"
          >
            <TabsList className="grid w-full grid-cols-2 bg-black-1">
              <TabsTrigger
                value="companies"
                className="data-[state=active]:bg-black-2"
              >
                {t("landingPage.tabs.companies")}
              </TabsTrigger>
              <TabsTrigger
                value="municipalities"
                className="data-[state=active]:bg-black-2"
              >
                {t("landingPage.tabs.municipalities")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="max-w-lg md:max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-7xl font-light tracking-tight">
            {t("landingPage.title", {
              tabName: t(`landingPage.tabName.${selectedTab}`),
            })}
          </h1>

          <div className="h-[80px] md:h-[120px] flex items-center justify-center text-4xl md:text-7xl font-light">
            <Typewriter
              text={
                selectedTab === "companies"
                  ? companyTypewriterTexts
                  : municipalityTypewriterTexts
              }
              speed={70}
              className="text-[#E2FF8D]"
              waitTime={2000}
              deleteSpeed={40}
              cursorChar="_"
            />
          </div>
        </div>

        <Button
          className="mt-8 md:mt-12 rounded-full px-6 md:px-8 py-4 md:py-6 text-base md:text-lg bg-white text-black hover:bg-white/90"
          asChild
        >
          <a
            href={
              selectedTab === "companies" ? "/companies" : "/municipalities"
            }
          >
            {t("landingPage.seeResults")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </div>

      {/* FIXME reintroduce at a later stage
      {selectedTab === "municipalities" && (
        <div className="py-16 md:py-24 bg-black-2">
          <div className="container mx-auto">
            <div className="max-w-lg md:max-w-[1200px] mx-auto">
              <MunicipalityComparison
                title="Hur går det med?"
                description="Vi utför mätningar av den samlade längden av cykelvägar per invånare, inklusive alla väghållare (statliga, kommunala och enskilda). Den senaste tillgängliga datan är från år 2022."
                nationalAverage={2.8}
                euTarget={3.8}
                unit="m"
                municipalities={municipalityComparisonData}
              />
            </div>
          </div>
        </div>
      )} */}

      <div className="py-8 md:py-24">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-8 md:mb-16">
            {t("landingPage.bestPerformers")}
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {" "}
            {/* FIXME add 2 columns for md when reintroducing company ranked list*/}
            <RankedList
              title={t("landingPage.bestMunicipalities")}
              description={t("landingPage.municipalitiesDescription")}
              items={topMunicipalities}
              type="municipality"
            />
            {/* FIXME reintroduce at a later stage with replaced items since emissions change rate is missleading.
            Could for instance be replaced with biggest emittiors in tCO2e
            <RankedList
              title={t("landingPage.bestCompanies")}
              description={t("landingPage.companiesDescription")}
              items={topCompanies}
              type="company"
            /> */}
          </div>
        </div>
      </div>

      <div className="pb-8 md:pb-16">
        <div className="container mx-auto">
          <ContentBlock
            title={t("landingPage.aboutUsTitle")}
            content={t("landingPage.aboutUsContent")}
          />
        </div>
      </div>
    </div>
  );
}
