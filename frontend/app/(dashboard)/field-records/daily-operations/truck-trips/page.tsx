"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { projects, equipment as mockEquipment, employees } from "@/lib/design-data";
import {
    Truck,
    MapPin,
    Clock,
    Package,
    Plus,
    Activity,
    Save,
    Trash2,
    Calendar,
    Layers,
    CheckCircle2,
    List
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { useSearchParams } from "next/navigation";

export default function TruckTripsPage() {
    const t = useTranslations("fieldRecords.dailyOperations");
    const common = useTranslations("app");
    const locale = useLocale();
    const isRTL = locale === "ar";
    const searchParams = useSearchParams();

    // Selection State
    const [project, setProject] = React.useState(searchParams.get("project") || "PRJ-2026-014");
    const [date, setDate] = React.useState(searchParams.get("date") || new Date().toISOString().split('T')[0]);
    const [shift, setShift] = React.useState(searchParams.get("shift") || "morning");

    // Filter trucks only
    const trucks = mockEquipment.filter(e => e.model.toLowerCase().includes("truck") || e.code.includes("TRK"));
    // Adding mock truck if none found
    const availableTrucks = trucks.length > 0 ? trucks : [
        { code: "TRK-01", model: "Volvo FMX Tipper" },
        { code: "TRK-02", model: "Mercedes Arocs" }
    ];

    const materials = [
        { value: "sub-base", label: isRTL ? "تربة أساس" : "Sub-base" },
        { value: "excavation", label: isRTL ? "ناتج حفر" : "Excavation Material" },
        { value: "asphalt", label: isRTL ? "إسفلت" : "Asphalt" },
    ];

    const [newTrip, setNewTrip] = React.useState({
        truckId: "",
        driverId: "",
        material: "sub-base",
        from: "",
        to: "",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        quantity: 25,
        notes: ""
    });

    const [trips, setTrips] = React.useState<any[]>([]);

    const handleAddTrip = () => {
        if (!newTrip.truckId) return;

        setTrips([
            { ...newTrip, id: Date.now().toString() },
            ...trips
        ]);

        // Reset but keep some helpful context
        setNewTrip({
            ...newTrip,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            notes: ""
        });
    };

    const removeTrip = (id: string) => {
        setTrips(trips.filter(t => t.id !== id));
    };

    // Calculations
    const stats = React.useMemo(() => {
        const totalTrips = trips.length;
        const totalQty = trips.reduce((acc, curr) => acc + (parseFloat(curr.quantity) || 0), 0);

        const byTruck = trips.reduce((acc: any, curr) => {
            acc[curr.truckId] = (acc[curr.truckId] || 0) + 1;
            return acc;
        }, {});

        return { totalTrips, totalQty, byTruck };
    }, [trips]);

    return (
        <div className="space-y-6 pb-12">
            <PageHeader
                title={t("trips.title")}
                description={t("trips.autoCalculate")}
            />

            {/* Primary Selection Header */}
            <div className="grid gap-4 p-4 rounded-xl border border-border bg-muted/30 md:grid-cols-3">
                <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-border">
                    <Calendar className="h-4 w-4 text-accent" />
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{common("date")}</p>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent text-sm font-bold border-none p-0 outline-none w-full" />
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-border">
                    <Layers className="h-4 w-4 text-accent" />
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{"Project"}</p>
                        <select value={project} onChange={(e) => setProject(e.target.value)} className="bg-transparent text-sm font-bold border-none p-0 outline-none w-full cursor-pointer appearance-none">
                            {projects.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-border">
                    <Clock className="h-4 w-4 text-accent" />
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{t("shifts.selector")}</p>
                        <div className="flex gap-2 mt-1">
                            {["morning", "night1", "night2"].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setShift(s)}
                                    className={cn(
                                        "text-[10px] font-bold px-2 py-0.5 rounded transition-all",
                                        shift === s ? "bg-accent text-white" : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    {t(`shifts.${s}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Quick Entry Form */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="p-6 border-accent/20 shadow-lg sticky top-24">
                        <h3 className="font-bold flex items-center gap-2 mb-6">
                            <div className="p-1.5 rounded-lg bg-accent/10">
                                <Plus className="h-4 w-4 text-accent" />
                            </div>
                            {t("trips.record")}
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                                    <Truck className="h-3 w-3" /> {t("trips.truck")}
                                </label>
                                <Select
                                    value={newTrip.truckId}
                                    onChange={(val) => setNewTrip({ ...newTrip, truckId: val })}
                                    options={availableTrucks.map(e => ({ value: e.code, label: `${e.code} - ${e.model}` }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                                    <Activity className="h-3 w-3" /> {t("trips.driver")}
                                </label>
                                <Select
                                    value={newTrip.driverId}
                                    onChange={(val) => setNewTrip({ ...newTrip, driverId: val })}
                                    options={employees.map(e => ({ value: e.id, label: e.name }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                                    <Package className="h-3 w-3" /> {t("trips.material")}
                                </label>
                                <Select
                                    value={newTrip.material}
                                    onChange={(val) => setNewTrip({ ...newTrip, material: val })}
                                    options={materials}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                                        <MapPin className="h-3 w-3" /> {t("trips.from")}
                                    </label>
                                    <input
                                        type="text"
                                        value={newTrip.from}
                                        onChange={(e) => setNewTrip({ ...newTrip, from: e.target.value })}
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-accent outline-none"
                                        placeholder="Loc A"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                                        <MapPin className="h-3 w-3" /> {t("trips.to")}
                                    </label>
                                    <input
                                        type="text"
                                        value={newTrip.to}
                                        onChange={(e) => setNewTrip({ ...newTrip, to: e.target.value })}
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-accent outline-none"
                                        placeholder="Loc B"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                                        <Clock className="h-3 w-3" /> {t("trips.time")}
                                    </label>
                                    <input
                                        type="time"
                                        value={newTrip.time}
                                        onChange={(e) => setNewTrip({ ...newTrip, time: e.target.value })}
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-accent outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                                        <CheckCircle2 className="h-3 w-3" /> {t("trips.quantity")} (m³)
                                    </label>
                                    <input
                                        type="number"
                                        value={newTrip.quantity}
                                        onChange={(e) => setNewTrip({ ...newTrip, quantity: parseFloat(e.target.value) })}
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-bold text-accent outline-none"
                                    />
                                </div>
                            </div>

                            <Button
                                variant="accent"
                                className="w-full gap-2 h-12 shadow-lg shadow-accent/20"
                                onClick={handleAddTrip}
                                disabled={!newTrip.truckId}
                            >
                                <Plus className="h-5 w-5" />
                                {isRTL ? "تسجيل الرد الآن" : "Record Trip Now"}
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Trips List and Live Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Bar */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="p-4 bg-accent/5 border-accent/10">
                            <p className="text-[10px] font-black uppercase text-accent tracking-widest">{t("dashboard.totalTrips")}</p>
                            <p className="text-3xl font-black">{stats.totalTrips}</p>
                        </Card>
                        <Card className="p-4 bg-success/5 border-success/10">
                            <p className="text-[10px] font-black uppercase text-success-text tracking-widest">{isRTL ? "إجمالي الكمية" : "Total Quantity"}</p>
                            <p className="text-3xl font-black text-success-text">{stats.totalQty} <span className="text-sm">m³</span></p>
                        </Card>
                        <Card className="p-4 bg-muted/50 border-border">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{isRTL ? "نشاط الشاحنات" : "Active Trucks"}</p>
                            <p className="text-3xl font-black">{Object.keys(stats.byTruck).length}</p>
                        </Card>
                    </div>

                    {/* Recent Trips Table */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <List className="h-4 w-4" />
                            {isRTL ? "الردود المسجلة لهذه الوردية" : "Recorded Trips for this Shift"}
                        </h4>

                        {trips.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-muted/30">
                                <Truck className="h-12 w-12 mb-4 opacity-20" />
                                <p className="text-sm font-medium">{isRTL ? "لا توجد ردود مسجلة بعد" : "No trips recorded yet"}</p>
                                <p className="text-xs">{isRTL ? "سجل الرد الأول من النموذج الجانبي" : "Record the first trip from the side form"}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {trips.map((trip) => (
                                    <Card key={trip.id} className="p-0 overflow-hidden hover:border-accent/40 transition-all shadow-sm group">
                                        <div className="flex">
                                            <div className="w-2 bg-accent" />
                                            <div className="flex-1 p-4 grid gap-4 md:grid-cols-4 items-center">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-black">{trip.truckId}</span>
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-bold text-muted-foreground uppercase">{trip.time}</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                        <Activity className="h-3 w-3" />
                                                        {employees.find(e => e.id === trip.driverId)?.name || trip.driverId}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1 text-xs">
                                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                                        <span className="font-semibold">{trip.from}</span>
                                                        <ArrowRight className="h-3 w-3 text-muted-foreground mx-1" />
                                                        <span className="font-semibold">{trip.to}</span>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-accent uppercase mt-1">{materials.find(m => m.value === trip.material)?.label}</p>
                                                </div>

                                                <div className="text-center">
                                                    <span className="text-xl font-black text-success-text">{trip.quantity}</span>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase ml-1">m³</span>
                                                </div>

                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-danger-text hover:bg-danger/10"
                                                        onClick={() => removeTrip(trip.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center text-success-text">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-6 right-6">
                <Button variant="accent" className="h-14 px-8 rounded-2xl shadow-2xl gap-3 flex items-center" onClick={() => alert("All shift records submitted!")}>
                    <Save className="h-6 w-6" />
                    <div className="text-start">
                        <p className="text-[10px] font-black uppercase opacity-70 leading-none">{t("shifts.selector")}: {t(`shifts.${shift}`)}</p>
                        <p className="font-black text-lg leading-tight">{isRTL ? "تأكيد وإرسال" : "Confirm & Submit"}</p>
                    </div>
                </Button>
            </div>
        </div>
    );
}

function ArrowRight({ className }: { className?: string }) {
    const locale = useLocale();
    const isRTL = locale === "ar";
    return (
        <svg
            className={cn(className, isRTL ? "rotate-180" : "")}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
    );
}
