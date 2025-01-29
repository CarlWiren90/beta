import { Info, Building2, TreePine } from 'lucide-react'
import { Text } from '@/components/ui/text'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Block } from '@/components/blocks/Block'
import { BlockHeader } from '@/components/blocks/BlockHeader'
import { BlockGrid } from '@/components/blocks/BlockGrid'
import { BlockMetric } from '@/components/blocks/BlockMetric'
import { MunicipalityMetricsHistory } from './MunicipalityMetricsHistory'
import type { MunicipalityDetails } from '@/types/municipality'

interface MunicipalityDetailsProps {
  municipality: MunicipalityDetails
}

export function MunicipalityDetails({
  municipality,
}: MunicipalityDetailsProps) {
  // Format emissions values with appropriate scaling
  const formatEmissions = (tons: number) => {
    if (tons >= 1500000) {
      // 1.5 million or more -> show in millions
      return `${(tons / 1000000).toFixed(1)}m`
    } else {
      // Less than 1.5 million -> show in thousands
      return `${Math.round(tons / 1000)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}k`
    }
  }

  return (
    <div className="space-y-8">
      {/* Overview Block */}
      <Block level={1} padding="large">
        <BlockHeader
          title={municipality.name}
          description={municipality.description}
          icon={<TreePine className="w-8 h-8 text-[#FDE7CE]" />}
        />

        <BlockGrid columns={3} gap="large" className="mt-12">
          <div>
            <Text variant="muted" className="mb-2">
              Ranking
            </Text>
            <Text variant="large">{municipality.rank}</Text>
          </div>

          <div>
            <Text variant="muted" className="mb-2">
              Koldioxidbudget tar slut
            </Text>
            <Text variant="large">{municipality.budgetRunsOut}</Text>
          </div>

          <div>
            <Text variant="muted" className="mb-2">
              Årlig minskning
            </Text>
            <Text
              variant="large"
              className={
                municipality.historicalEmissionChangePercent > 0
                  ? 'text-pink-3'
                  : 'text-green-3'
              }
            >
              {municipality.historicalEmissionChangePercent > 0 ? '+' : ''}
              {municipality.historicalEmissionChangePercent.toFixed(1)}%
            </Text>
          </div>
        </BlockGrid>
      </Block>

      {/* Emissions Block */}
      <Block level={1} padding="large">
        <div className="flex items-baseline justify-between mb-12">
          <div className="flex items-baseline gap-4">
            <Text variant="h3">Totala utsläpp</Text>
            <Text variant="muted">(tusen ton CO₂e)</Text>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-grey" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Territoriella utsläpp inom kommunens gränser</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Text className="text-[120px] font-light text-orange-2 tracking-tighter leading-none">
          {formatEmissions(municipality.trendEmission)}
        </Text>
      </Block>

      {/* Metrics History */}
      <MunicipalityMetricsHistory municipality={municipality} />

      {/* Key Metrics */}
      <Block level={1} padding="large">
        <BlockHeader
          title="Nyckeltal"
          description="Viktiga mätpunkter för kommunens klimatarbete"
        />

        <BlockGrid columns={2} gap="medium" className="mt-12">
          <div className="space-y-6">
            <Text variant="h4">Cykelväg per invånare</Text>
            <div className="grid grid-cols-2 gap-4">
              <BlockMetric
                label="Kommunen"
                value={municipality.bicycleMetrePerCapita.toFixed(1)}
                unit="m"
                icon={<TreePine className="w-4 h-4" />}
                color="var(--orange-2)"
              />
              <BlockMetric
                label="Rikssnitt"
                value="2.8"
                unit="m"
                color="var(--pink-3)"
              />
              <BlockMetric
                label="Bäst i landet"
                value="4.2"
                unit="m"
                color="var(--green-3)"
              />
              <BlockMetric
                label="Sämst i landet"
                value="1.2"
                unit="m"
                color="var(--grey)"
              />
            </div>
          </div>

          <div className="space-y-6">
            <Text variant="h4">Elbilar per laddpunkt</Text>
            <div className="grid grid-cols-2 gap-4">
              <BlockMetric
                label="Kommunen"
                value={municipality.electricVehiclePerChargePoints.toFixed(1)}
                icon={<Building2 className="w-4 h-4" />}
                color="var(--blue-2)"
              />
              <BlockMetric
                label="Rikssnitt"
                value="15.2"
                color="var(--pink-3)"
              />
              <BlockMetric
                label="Bäst i landet"
                value="8.4"
                color="var(--green-3)"
              />
              <BlockMetric
                label="Sämst i landet"
                value="32.6"
                color="var(--grey)"
              />
            </div>
          </div>
        </BlockGrid>
      </Block>

      {/* Climate Plan */}
      {municipality.climatePlanLink && (
        <Block level={2} padding="medium">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="h4">Klimatplan</Text>
              <Text variant="muted">
                {municipality.climatePlanYear === 'Saknar plan'
                  ? 'Saknar plan'
                  : `Antagen ${municipality.climatePlanYear}`}
              </Text>
            </div>
            <a
              href={municipality.climatePlanLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-2 hover:text-blue-1 transition-colors"
            >
              Läs mer →
            </a>
          </div>
        </Block>
      )}
    </div>
  )
}
