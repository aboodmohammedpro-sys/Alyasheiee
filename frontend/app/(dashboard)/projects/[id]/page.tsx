"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { DataTable } from "@/components/shared/DataTable";
import { projects, employees, equipment, inventoryItems, toneForStatus } from "@/lib/design-data";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectOverview } from "./_components/ProjectOverview";
import { ProjectPhases } from "./_components/ProjectPhases";
import { ProjectTeams } from "./_components/ProjectTeams";
import { ProjectEquipment } from "./_components/ProjectEquipment";
import {
  BarChart3,
  Calendar,
  Users,
  Truck,
  Package,
  Settings,
  ChevronRight,
  Clock,
  TrendingDown,
  Info
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function ProjectDetailPage() {
  const t = useTranslations("projects.tabs");
  const pt = useTranslations("projects");
  const app = useTranslations("app");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [activeTab, setActiveTab] = React.useState("overview");

  const tabs = [
    { id: "overview", label: t("overview"), icon: BarChart3 },
    { id: "phases", label: t("phases"), icon: Calendar },
    { id: "teams", label: t("teams"), icon: Users },
    { id: "equipment", label: t("equipment"), icon: Truck },
    { id: "materials", label: t("materials"), icon: Package },
    { id: "settings", label: t("settings"), icon: Settings },
  ];

  const phasesData = [
    { id: "PH-001", name: isRTL ? "تجهيز الموقع" : "Site Mobilization", status: "Completed", start: "2026-01-12", end: "2026-02-01", progress: 100 },
    { id: "PH-002", name: isRTL ? "الحفريات والأعمال الترابية" : "Excavation & Earthworks", status: "Working", start: "2026-02-05", end: "2026-04-15", progress: 68 },
    { id: "PH-003", name: isRTL ? "خوازيق الأساسات" : "Foundation Piling", status: "Draft", start: "2026-04-20", end: "2026-06-30", progress: 0 },
  ];

  const project = projects[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name}
        description={`${pt("projectCode")}: ${project.code} | ${pt("manager")}: ${project.manager}`}
        actions={
          <div className="flex gap-2">
            <Badge tone={toneForStatus(project.status)} className="h-9 px-4 text-xs font-bold uppercase tracking-wider">
              {project.status}
            </Badge>
            <ButtonLink href="/projects" variant="outline">{app("back")}</ButtonLink>
          </div>
        }
      />

      <div className="flex border-b border-border overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap",
                isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <ProjectOverview project={project} phasesData={phasesData} />
          )}

          {activeTab === "phases" && (
            <ProjectPhases phasesData={phasesData} />
          )}

          {activeTab === "teams" && (
            <ProjectTeams project={project} employees={employees} />
          )}

          {activeTab === "equipment" && (
            <ProjectEquipment project={project} equipment={equipment} />
          )}

          {activeTab === "materials" && (
            <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-semibold">{isRTL ? "تكامل سجلات المواد" : "Material Log integration"}</p>
              <p className="text-sm">{isRTL ? "جاري جلب المواد المرتبطة وطلبات الموقع..." : "Fetching associated materials and site requisitions..."}</p>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-bold text-foreground mb-1">{isRTL ? "تفضيلات المشروع" : "Project Preferences"}</h3>
              <p className="text-sm max-w-md mx-auto">{isRTL ? "إدارة حدود الميزانية والمستلمين والمعايير الخاصة بالمشروع." : "Manage budget thresholds, recipients, and project-specific parameters."}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

