"use client";

import dynamic from "next/dynamic";
import { type ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function DashboardChart() {
    const options: ApexOptions = {
        chart: {
            type: "area",
            toolbar: { show: false },
            zoom: { enabled: false },
            background: "transparent",
        },
        theme: {
            mode: "light", // This will be overridden by CSS/manual toggle if needed
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        colors: ["#f97316"], // Safety Orange (--accent)
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100, 100],
            },
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            borderColor: "#e2e8f0",
            strokeDashArray: 4,
            padding: {
                left: 0,
                right: 0,
            },
        },
        xaxis: {
            categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            show: false,
        },
        tooltip: {
            theme: "dark",
        },
    };

    const series = [
        {
            name: "Fuel Consumption",
            data: [31, 40, 28, 51, 42, 109, 100],
        },
    ];

    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Fuel Usage Analytics</h2>
                    <p className="text-xs text-muted-foreground">Daily diesel dispatch across all projects</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold">42.8k L</p>
                    <p className="text-xs text-success-text">+12% from last week</p>
                </div>
            </div>
            <div className="h-[250px] w-full">
                <Chart options={options} series={series} type="area" height="100%" />
            </div>
        </div>
    );
}
