'use client';

import type { Plan, PlanSections, SectionKey } from '@build-planner/shared';
import { EditableSectionCard } from './EditableSectionCard';
import { CompetitorTable } from './CompetitorTable';
import { SwotGrid } from './SwotGrid';
import ReactMarkdown from 'react-markdown';

interface PlanPreviewProps {
  plan: Plan;
  onUpdatePlan?: (updatedPlan: Plan) => void;
}

export function PlanPreview({ plan, onUpdatePlan }: PlanPreviewProps) {
  const s = plan.sections;

  // Helper to handle updating a single section in the plan object
  const handleSectionUpdate = (sectionKey: SectionKey, updatedContent: any) => {
    if (!onUpdatePlan) return;

    const newSections: PlanSections = {
      ...plan.sections,
      [sectionKey]: updatedContent,
    };

    onUpdatePlan({
      ...plan,
      sections: newSections,
    });
  };

  return (
    <article className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      {/* Plan header */}
      <header className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-8 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--color-teal)]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-teal)]">
            Business Plan
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-heading)] mb-2 tracking-tight">
          {plan.businessName}
        </h1>
        <p className="text-[var(--color-muted)] text-base font-medium">{plan.tagline}</p>
        <p className="text-xs text-[var(--color-muted)] mt-4 opacity-70">
          Generated {new Date(plan.generatedAt).toLocaleDateString('en-GB', { dateStyle: 'long' })}
        </p>
      </header>

      {/* Standard prose sections */}
      <EditableSectionCard
        title={s.executiveSummary.title}
        sectionKey="executiveSummary"
        currentContent={s.executiveSummary}
        onUpdateSection={(data) => handleSectionUpdate('executiveSummary', data)}
      >
        <div className="plan-prose text-sm text-[var(--color-body)] leading-relaxed">
          {typeof s.executiveSummary.content === 'string' && s.executiveSummary.content.startsWith('<') ? (
            <div dangerouslySetInnerHTML={{ __html: s.executiveSummary.content }} />
          ) : (
            <ReactMarkdown>{s.executiveSummary.content}</ReactMarkdown>
          )}
        </div>
      </EditableSectionCard>

      <EditableSectionCard
        title={s.companyDescription.title}
        sectionKey="companyDescription"
        currentContent={s.companyDescription}
        onUpdateSection={(data) => handleSectionUpdate('companyDescription', data)}
      >
        <div className="plan-prose text-sm text-[var(--color-body)] leading-relaxed">
          {typeof s.companyDescription.content === 'string' && s.companyDescription.content.startsWith('<') ? (
            <div dangerouslySetInnerHTML={{ __html: s.companyDescription.content }} />
          ) : (
            <ReactMarkdown>{s.companyDescription.content}</ReactMarkdown>
          )}
        </div>
      </EditableSectionCard>

      <EditableSectionCard
        title={s.productsServices.title}
        sectionKey="productsServices"
        currentContent={s.productsServices}
        onUpdateSection={(data) => handleSectionUpdate('productsServices', data)}
      >
        <div className="plan-prose text-sm text-[var(--color-body)] leading-relaxed">
          {typeof s.productsServices.content === 'string' && s.productsServices.content.startsWith('<') ? (
            <div dangerouslySetInnerHTML={{ __html: s.productsServices.content }} />
          ) : (
            <ReactMarkdown>{s.productsServices.content}</ReactMarkdown>
          )}
        </div>
      </EditableSectionCard>

      <EditableSectionCard
        title={s.marketAnalysis.title}
        sectionKey="marketAnalysis"
        currentContent={s.marketAnalysis}
        onUpdateSection={(data) => handleSectionUpdate('marketAnalysis', data)}
      >
        <div className="plan-prose text-sm text-[var(--color-body)] leading-relaxed">
          {typeof s.marketAnalysis.content === 'string' && s.marketAnalysis.content.startsWith('<') ? (
            <div dangerouslySetInnerHTML={{ __html: s.marketAnalysis.content }} />
          ) : (
            <ReactMarkdown>{s.marketAnalysis.content}</ReactMarkdown>
          )}
        </div>
      </EditableSectionCard>

      {/* Competitive landscape — prose + competitor table */}
      <EditableSectionCard
        title={s.competitiveLandscape.title}
        sectionKey="competitiveLandscape"
        currentContent={s.competitiveLandscape}
        onUpdateSection={(data) => handleSectionUpdate('competitiveLandscape', data)}
      >
        {s.competitiveLandscape.content && (
          <div className="plan-prose text-sm text-[var(--color-body)] mb-6 leading-relaxed">
            {typeof s.competitiveLandscape.content === 'string' && s.competitiveLandscape.content.startsWith('<') ? (
              <div dangerouslySetInnerHTML={{ __html: s.competitiveLandscape.content }} />
            ) : (
              <ReactMarkdown>{s.competitiveLandscape.content}</ReactMarkdown>
            )}
          </div>
        )}
        <CompetitorTable competitors={s.competitiveLandscape.competitors} />
      </EditableSectionCard>

      <EditableSectionCard
        title={s.marketingStrategy.title}
        sectionKey="marketingStrategy"
        currentContent={s.marketingStrategy}
        onUpdateSection={(data) => handleSectionUpdate('marketingStrategy', data)}
      >
        <div className="plan-prose text-sm text-[var(--color-body)] leading-relaxed">
          {typeof s.marketingStrategy.content === 'string' && s.marketingStrategy.content.startsWith('<') ? (
            <div dangerouslySetInnerHTML={{ __html: s.marketingStrategy.content }} />
          ) : (
            <ReactMarkdown>{s.marketingStrategy.content}</ReactMarkdown>
          )}
        </div>
      </EditableSectionCard>

      <EditableSectionCard
        title={s.operationsPlan.title}
        sectionKey="operationsPlan"
        currentContent={s.operationsPlan}
        onUpdateSection={(data) => handleSectionUpdate('operationsPlan', data)}
      >
        <div className="plan-prose text-sm text-[var(--color-body)] leading-relaxed">
          {typeof s.operationsPlan.content === 'string' && s.operationsPlan.content.startsWith('<') ? (
            <div dangerouslySetInnerHTML={{ __html: s.operationsPlan.content }} />
          ) : (
            <ReactMarkdown>{s.operationsPlan.content}</ReactMarkdown>
          )}
        </div>
      </EditableSectionCard>

      <EditableSectionCard
        title={s.managementTeam.title}
        sectionKey="managementTeam"
        currentContent={s.managementTeam}
        onUpdateSection={(data) => handleSectionUpdate('managementTeam', data)}
      >
        <div className="plan-prose text-sm text-[var(--color-body)] leading-relaxed">
          {typeof s.managementTeam.content === 'string' && s.managementTeam.content.startsWith('<') ? (
            <div dangerouslySetInnerHTML={{ __html: s.managementTeam.content }} />
          ) : (
            <ReactMarkdown>{s.managementTeam.content}</ReactMarkdown>
          )}
        </div>
      </EditableSectionCard>

      {/* SWOT — structured grid */}
      <EditableSectionCard
        title={s.swot.title}
        sectionKey="swot"
        currentContent={s.swot}
        onUpdateSection={(data) => handleSectionUpdate('swot', data)}
        isProse={false}
      >
        <SwotGrid swot={s.swot} />
      </EditableSectionCard>

      {/* Financial plan — placeholder treatment */}
      <EditableSectionCard
        title={s.financialPlanPlaceholder.title}
        sectionKey="financialPlanPlaceholder"
        currentContent={s.financialPlanPlaceholder}
        onUpdateSection={(data) => handleSectionUpdate('financialPlanPlaceholder', data)}
      >
        <div className="plan-prose text-sm text-[var(--color-body)] leading-relaxed">
          {typeof s.financialPlanPlaceholder.content === 'string' && s.financialPlanPlaceholder.content.startsWith('<') ? (
            <div dangerouslySetInnerHTML={{ __html: s.financialPlanPlaceholder.content }} />
          ) : (
            <ReactMarkdown>{s.financialPlanPlaceholder.content}</ReactMarkdown>
          )}
        </div>
      </EditableSectionCard>
    </article>
  );
}
