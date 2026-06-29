"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { projects, equipment as mockEquipment, employees } from "@/lib/design-data";
import {
    Save,
    Settings,
    Trash2,
    Plus,
    History,
    AlertTriangle,
    User,
    MessageSquare,
    Clock,
    Play,
    Square,
    Minus,
    ChevronDown,
    ChevronUp,
    FileText
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { useSearchParams } from "next/navigation";

export default function EquipmentHoursPage() {
    const t = useTranslations("fieldRecords.dailyOperations");
    const common = useTranslations("app");
    const locale = useLocale();
    const isRTL = locale === "ar";
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = React.useState(false);
    const [expandedNotes, setExpandedNotes] = React.useState<Record<string, boolean>>({});

    // Selection State
    const [project, setProject] = React.useState(searchParams.get("project") || "PRJ-2026-014");
    const [date, setDate] = React.useState(searchParams.get("date") || new Date().toISOString().split('T')[0]);
    const [shift, setShift] = React.useState(searchParams.get("shift") || "morning");

    // Default shift times
    const shiftDefaults: Record<string, { start: string; end: string }> = {
        morning: { start: "06:00", end: "14:00" },
        night1: { start: "14:00", end: "22:00" },
        night2: { start: "22:00", end: "06:00" },
    };

    // Calculate hours from two time strings
    const calcHours = (startTime: string, endTime: string): number => {
        if (!startTime || !endTime) return 0;
        const [sh, sm] = startTime.split(":").map(Number);
        const [eh, em] = endTime.split(":").map(Number);
        let startMin = sh * 60 + sm;
        let endMin = eh * 60 + em;
        if (endMin <= startMin) endMin += 24 * 60; // overnight shift
        return parseFloat(((endMin - startMin) / 60).toFixed(2));
    };

    // Records State
    const [records, setRecords] = React.useState<any[]>([
        {
            id: "1",
            equipmentId: "EQ-CAT-320-08",
            startTime: shiftDefaults["morning"].start,
            endTime: shiftDefaults["morning"].end,
            workHours: 7.5,
            idleHours: 0.5,
            breakdownHours: 0,
            breakdownReason: "",
            operatorId: "EMP-0142",
            notes: ""
        }
    ]);

    // Update records when shift changes to update default start/end times for initial setup
    const prevShift = React.useRef(shift);
    React.useEffect(() => {
        if (prevShift.current !== shift) {
            const defaults = shiftDefaults[shift];
            setRecords(prev => prev.map(r => {
                const updated = {
                    ...r,
                    startTime: defaults.start,
                    endTime: defaults.end
                };
                const total = calcHours(defaults.start, defaults.end);
                const idle = parseFloat(updated.idleHours) || 0;
                const breakdown = parseFloat(updated.breakdownHours) || 0;
                updated.workHours = Math.max(0, parseFloat((total - idle - breakdown).toFixed(2)));
                return updated;
            }));
            prevShift.current = shift;
        }
    }, [shift]);

    const addRecord = () => {
        const defaults = shiftDefaults[shift] || shiftDefaults.morning;
        const newId = Math.random().toString(36).substr(2, 9);
        setRecords([
            ...records,
            {
                id: newId,
                equipmentId: "",
                startTime: defaults.start,
                endTime: defaults.end,
                workHours: calcHours(defaults.start, defaults.end),
                idleHours: 0,
                breakdownHours: 0,
                breakdownReason: "",
                operatorId: "",
                notes: ""
            }
        ]);
    };

    const updateRecord = (id: string, field: string, value: any) => {
        setRecords(records.map(r => {
            if (r.id === id) {
                const updated = { ...r, [field]: value };

                // Get fresh values
                const startT = updated.startTime;
                const endT = updated.endTime;
                const idle = parseFloat(updated.idleHours) || 0;
                const breakdown = parseFloat(updated.breakdownHours) || 0;

                const total = calcHours(startT, endT);
                updated.workHours = Math.max(0, parseFloat((total - idle - breakdown).toFixed(2)));

                return updated;
            }
            return r;
        }));
    };

    const adjustHours = (id: string, field: "idleHours" | "breakdownHours", delta: number) => {
        setRecords(records.map(r => {
            if (r.id === id) {
                const current = parseFloat(r[field]) || 0;
                const nextVal = Math.max(0, Math.min(24, current + delta));
                const updated = { ...r, [field]: nextVal };

                const startT = updated.startTime;
                const endT = updated.endTime;
                const idle = parseFloat(updated.idleHours) || 0;
                const breakdown = parseFloat(updated.breakdownHours) || 0;

                const total = calcHours(startT, endT);
                updated.workHours = Math.max(0, parseFloat((total - idle - breakdown).toFixed(2)));

                return updated;
            }
            return r;
        }));
    };

    const removeRecord = (id: string) => {
        setRecords(records.filter(r => r.id !== id));
    };

    const toggleNotes = (id: string) => {
        setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert(isRTL ? "تم حفظ سجلات ساعات المعدات بنجاح" : "Equipment hours recorded successfully");
        }, 1500);
    };

    return (
        <div className="space-y-6 pb-32">
            <PageHeader
                title={t("equipment.title")}
                description={t("equipment.oneRecordPerShift")}
                actions={
                    <Button variant="accent" className="gap-2 shadow-lg shadow-accent/20" onClick={handleSave} isLoading={isLoading}>
                        <Save className="h-4 w-4" />
                        {common("save")}
                    </Button>
                }
            />

            {/* Primary Selection Header */}
            <div className="grid gap-4 p-4 rounded-xl border border-border bg-muted/30 md:grid-cols-3">
                <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-border">
                    <History className="h-4 w-4 text-accent" />
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{common("date")}</p>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-transparent text-sm font-bold border-none p-0 outline-none w-full cursor-pointer"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-border">
                    <Settings className="h-4 w-4 text-accent" />
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{isRTL ? "المشروع" : "Project"}</p>
                        <select
                            value={project}
                            onChange={(e) => setProject(e.target.value)}
                            className="bg-transparent text-sm font-bold border-none p-0 outline-none w-full cursor-pointer appearance-none"
                        >
                            {projects.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-border">
                    <Clock className="h-4 w-4 text-accent" />
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{t("shifts.selector")}</p>
                        <div className="flex gap-1 mt-1">
                            {["morning", "night1", "night2"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setShift(s)}
                                    className={cn(
                                        "text-[10px] font-bold px-2.5 py-1 rounded transition-all",
                                        shift === s ? "bg-accent text-white shadow-sm" : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    {t(`shifts.${s}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Equipment Records List */}
            <div className="space-y-4">
                {records.map((record, index) => {
                    const totalDuration = calcHours(record.startTime, record.endTime);
                    const isNotesOpen = expandedNotes[record.id];
                    const hasNotes = !!record.notes;
                    const hasBreakdown = parseFloat(record.breakdownHours) > 0;

                    return (
                        <Card key={record.id} className="p-0 overflow-hidden border-border/80 shadow-md hover:border-accent/40 transition-colors">
                            {/* Card Header Bar */}
                            <div className="flex items-center justify-between bg-muted/40 px-4 py-3 border-b border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-full bg-accent/15 flex items-center justify-center text-xs font-black text-accent-text">
                                        {index + 1}
                                    </div>
                                    <span className="font-bold text-sm tracking-wide text-foreground">
                                        {isRTL ? "سجل المعدة" : "Equipment Entry"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "h-8 px-3 gap-1 text-[11px] font-semibold text-muted-foreground",
                                            hasNotes && "text-accent bg-accent/5 hover:bg-accent/10"
                                        )}
                                        onClick={() => toggleNotes(record.id)}
                                    >
                                        <FileText className="h-3.5 w-3.5" />
                                        {isRTL ? "ملاحظات" : "Notes"}
                                        {isNotesOpen ? <ChevronUp className="h-3 w-3 ml-0.5" /> : <ChevronDown className="h-3 w-3 ml-0.5" />}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-danger-text hover:bg-danger/10"
                                        onClick={() => removeRecord(record.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Card Body - Grid */}
                            <div className="p-4 grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 items-end">
                                {/* 1. Equipment Selection */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                                        {isRTL ? "اختر المعدة" : "Equipment"}
                                    </label>
                                    <Select
                                        value={record.equipmentId}
                                        onChange={(val) => updateRecord(record.id, "equipmentId", val)}
                                        options={mockEquipment.map(e => ({ value: e.code, label: `${e.code} - ${e.model}` }))}
                                    />
                                </div>

                                {/* 2. Start/End Time Inputs */}
                                <div className="space-y-2 bg-muted/20 p-2.5 rounded-xl border border-border/50">
                                    <div className="flex justify-between items-center mb-1 bg-card px-1.5 py-0.5 rounded border border-border">
                                        <span className="text-[8px] font-black text-muted-foreground uppercase">{isRTL ? "مدة العمل بالوردية" : "Shift Duration"}</span>
                                        <span className="text-[10px] font-black text-accent">{totalDuration}h</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-0.5">
                                            <span className="text-[8px] font-bold text-muted-foreground uppercase flex items-center gap-0.5">
                                                <Play className="h-2 w-2 text-success-text" /> {isRTL ? "بدء" : "Start"}
                                            </span>
                                            <input
                                                type="time"
                                                value={record.startTime}
                                                onChange={(e) => updateRecord(record.id, "startTime", e.target.value)}
                                                className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs font-bold focus:border-accent outline-none"
                                            />
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[8px] font-bold text-muted-foreground uppercase flex items-center gap-0.5">
                                                <Square className="h-2 w-2 text-danger-text" /> {isRTL ? "إيقاف" : "Stop"}
                                            </span>
                                            <input
                                                type="time"
                                                value={record.endTime}
                                                onChange={(e) => updateRecord(record.id, "endTime", e.target.value)}
                                                className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs font-bold focus:border-accent outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Incrementable Counters (Idle, Breakdown) */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Idle Hours */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-warning-text flex justify-between">
                                            <span>{t("equipment.idleHours")}</span>
                                        </label>
                                        <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden h-10">
                                            <button
                                                type="button"
                                                onClick={() => adjustHours(record.id, "idleHours", -0.5)}
                                                className="h-full px-2 hover:bg-muted text-muted-foreground transition-colors"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <input
                                                type="number"
                                                step="0.5"
                                                min="0"
                                                value={record.idleHours}
                                                onChange={(e) => updateRecord(record.id, "idleHours", parseFloat(e.target.value) || 0)}
                                                className="w-full text-center border-none focus:outline-none text-xs font-black text-warning-text bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => adjustHours(record.id, "idleHours", 0.5)}
                                                className="h-full px-2 hover:bg-muted text-muted-foreground transition-colors"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Breakdown Hours */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-danger-text flex justify-between">
                                            <span>{t("equipment.breakdown")}</span>
                                        </label>
                                        <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden h-10">
                                            <button
                                                type="button"
                                                onClick={() => adjustHours(record.id, "breakdownHours", -0.5)}
                                                className="h-full px-2 hover:bg-muted text-muted-foreground transition-colors"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <input
                                                type="number"
                                                step="0.5"
                                                min="0"
                                                value={record.breakdownHours}
                                                onChange={(e) => updateRecord(record.id, "breakdownHours", parseFloat(e.target.value) || 0)}
                                                className="w-full text-center border-none focus:outline-none text-xs font-black text-danger-text bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => adjustHours(record.id, "breakdownHours", 0.5)}
                                                className="h-full px-2 hover:bg-muted text-muted-foreground transition-colors"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Working Hours Results Bar */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-success-text">
                                        {t("equipment.workingHours")}
                                    </label>
                                    <div className={cn(
                                        "h-10 w-full rounded-xl flex items-center justify-between px-4 transition-all duration-300 font-black text-sm",
                                        record.workHours > 0
                                            ? "bg-success/10 border border-success-text/30 text-success-text"
                                            : "bg-muted border border-border text-muted-foreground"
                                    )}>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4" />
                                            <span>{record.workHours}h</span>
                                        </div>
                                        <span className="text-[9px] font-black uppercase opacity-85">
                                            {isRTL ? "صافي العمل" : "Net Hours"}
                                        </span>
                                    </div>
                                </div>

                                {/* 5. Operator Selection */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                        <User className="h-3 w-3" /> {t("equipment.operator")}
                                    </label>
                                    <Select
                                        value={record.operatorId}
                                        onChange={(val) => updateRecord(record.id, "operatorId", val)}
                                        options={employees.map(e => ({ value: e.id, label: e.name }))}
                                    />
                                </div>
                            </div>

                            {/* Expanded Breakdown Reason Input */}
                            {hasBreakdown && (
                                <div className="px-4 pb-4 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-3 bg-danger/5 border border-danger/20 rounded-xl space-y-2">
                                        <label className="text-[10px] font-black uppercase text-danger-text flex items-center gap-1">
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                            {t("equipment.breakdownReason")}
                                        </label>
                                        <input
                                            type="text"
                                            value={record.breakdownReason}
                                            onChange={(e) => updateRecord(record.id, "breakdownReason", e.target.value)}
                                            className="h-10 w-full rounded-md border border-danger/30 bg-background px-3 text-xs focus:border-danger outline-none"
                                            placeholder={isRTL ? "مثال: تسريب في الباكر الميداني أو سخونة المحرك..." : "e.g., Hydraulic leak, Engine overheating..."}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Collapsible Notes Field */}
                            {isNotesOpen && (
                                <div className="px-4 pb-4 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-3 bg-accent/5 border border-accent/20 rounded-xl space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-accent-text flex items-center gap-1">
                                            <MessageSquare className="h-3.5 w-3.5" />
                                            {common("notes")}
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={record.notes}
                                            onChange={(e) => updateRecord(record.id, "notes", e.target.value)}
                                            className="w-full rounded-md border border-border bg-background p-2.5 text-xs focus:border-accent outline-none"
                                            placeholder={isRTL ? "ملاحظات إضافية عن أداء المعدة أثناء الوردية..." : "Any additional comments about equipment performance..."}
                                        />
                                    </div>
                                </div>
                            )}
                        </Card>
                    );
                })}

                {/* Add New Line Button */}
                <Button
                    variant="outline"
                    className="w-full border-dashed border-2 py-8 group hover:border-accent hover:bg-accent/5 transition-all text-muted-foreground hover:text-accent rounded-xl"
                    onClick={addRecord}
                >
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                            <Plus className="h-5 w-5" />
                        </div>
                        <span className="font-black text-xs tracking-widest uppercase">{t("equipment.record")}</span>
                    </div>
                </Button>
            </div>

            {/* Floating Summary Bar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-7xl px-4 py-3 rounded-2xl bg-card/95 backdrop-blur-md border-2 border-accent shadow-2xl z-50 flex items-center justify-between">
                <div className="flex gap-6">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-muted-foreground uppercase">{t("dashboard.operatingEquipment")}</span>
                        <span className="text-sm font-bold">{records.length}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-success-text uppercase">{t("equipment.workingHours")}</span>
                        <span className="text-sm font-bold text-success-text">
                            {records.reduce((acc, curr) => acc + parseFloat(curr.workHours || 0), 0).toFixed(1)}h
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-warning-text uppercase">{t("equipment.idleHours")}</span>
                        <span className="text-sm font-bold text-warning-text">
                            {records.reduce((acc, curr) => acc + parseFloat(curr.idleHours || 0), 0).toFixed(1)}h
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-danger-text uppercase">{t("equipment.breakdown")}</span>
                        <span className="text-sm font-bold text-danger-text">
                            {records.reduce((acc, curr) => acc + parseFloat(curr.breakdownHours || 0), 0).toFixed(1)}h
                        </span>
                    </div>
                </div>
                <Button variant="accent" className="gap-2 px-8 shadow-lg shadow-accent/20" onClick={handleSave} isLoading={isLoading}>
                    <Save className="h-4 w-4" />
                    {common("save")}
                </Button>
            </div>
        </div>
    );
}
