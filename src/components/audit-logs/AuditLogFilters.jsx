"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // Ensure you have this shadcn component
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ENTITY_TYPES = [
  "Member",
  "Invoice",
  "Payment",
  "Expense",
  "Income",
  "Category",
  "BankAccount",
  "Donation",
  "User",
];

const ACTIONS = ["CREATE", "UPDATE", "DELETE"];

export default function AuditLogFilters({ filters, onFilterChange }) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // Helper to count active filters for the badge
  const activeFilterCount = [
    filters.entityType,
    filters.action,
    filters.startDate,
    filters.endDate,
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    onFilterChange({
      entityType: "",
      action: "",
      userId: "",
      search: "",
      startDate: "",
      endDate: "",
    });
    setIsFilterOpen(false);
  };

  const handleDateSelect = (range) => {
    onFilterChange({
      startDate: range?.from ? format(range.from, "yyyy-MM-dd") : "",
      endDate: range?.to ? format(range.to, "yyyy-MM-dd") : "",
    });
  };

  // Convert string dates back to Date objects for the Calendar component
  const dateRange = {
    from: filters.startDate ? new Date(filters.startDate) : undefined,
    to: filters.endDate ? new Date(filters.endDate) : undefined,
  };

  return (
    <div className="w-full space-y-4">
      {/* --- Main Toolbar --- */}
      <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-slate-300">
        {/* Search Input (Primary Action) */}
        <div className="relative flex-1 w-full lg:max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
          <Input
            placeholder="Search logs by name, ID, or description..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-9 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 h-10"
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto px-1 pb-1 lg:pb-0 justify-end">
          {/* Desktop: Quick Date Picker */}
          <div className="hidden md:block">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9 justify-start text-left font-normal border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors",
                    !dateRange.from && "text-slate-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Separator
            orientation="vertical"
            className="h-6 hidden lg:block mx-1"
          />

          {/* Filter Toggle Button */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={activeFilterCount > 0 ? "secondary" : "outline"}
                size="sm"
                className={cn(
                  "h-9 w-full lg:w-auto gap-2 border-slate-200 transition-all",
                  activeFilterCount > 0 &&
                    "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
                )}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 min-w-[1.25rem] rounded-full px-1 flex items-center justify-center bg-emerald-200 text-emerald-800 text-[10px]"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[calc(100vw-2rem)] sm:w-80 p-4"
              align="end"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Filter Logs</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="h-auto p-0 text-slate-500 text-xs hover:text-red-600 hover:bg-transparent"
                  >
                    Reset all
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Entity Type
                  </label>
                  <Select
                    value={filters.entityType || "All"}
                    onValueChange={(value) =>
                      onFilterChange({
                        entityType: value === "All" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="All Entities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Entities</SelectItem>
                      {ENTITY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Action Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["All", ...ACTIONS].map((action) => {
                      const isSelected =
                        filters.action === action ||
                        (action === "All" && !filters.action);
                      return (
                        <div
                          key={action}
                          onClick={() =>
                            onFilterChange({
                              action: action === "All" ? "" : action,
                            })
                          }
                          className={cn(
                            "cursor-pointer px-3 py-1.5 rounded-full text-xs font-medium border transition-all select-none",
                            isSelected
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                          )}
                        >
                          {action}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Only Date Picker Inputs (Fallback when calendar popover is hidden) */}
                <div className="md:hidden space-y-2 pt-4 mt-2 border-t border-slate-100">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400">Start</span>
                      <Input
                        type="date"
                        className="h-9 text-xs"
                        value={filters.startDate}
                        onChange={(e) =>
                          onFilterChange({ startDate: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400">End</span>
                      <Input
                        type="date"
                        className="h-9 text-xs"
                        value={filters.endDate}
                        onChange={(e) =>
                          onFilterChange({ endDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* --- Active Filters Display (Chips) --- */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <span className="text-xs text-slate-500 font-medium mr-1">
            Active:
          </span>

          {filters.entityType && (
            <Badge
              variant="outline"
              className="bg-white border-slate-200 text-slate-700 pl-2 pr-1 py-1 gap-1 font-normal shadow-sm"
            >
              Entity:{" "}
              <span className="font-semibold text-slate-900">
                {filters.entityType}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
                onClick={() => onFilterChange({ entityType: "" })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.action && (
            <Badge
              variant="outline"
              className="bg-white border-slate-200 text-slate-700 pl-2 pr-1 py-1 gap-1 font-normal shadow-sm"
            >
              Action:{" "}
              <span className="font-semibold text-slate-900">
                {filters.action}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
                onClick={() => onFilterChange({ action: "" })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {(filters.startDate || filters.endDate) && (
            <Badge
              variant="outline"
              className="bg-white border-slate-200 text-slate-700 pl-2 pr-1 py-1 gap-1 font-normal shadow-sm"
            >
              Date:{" "}
              <span className="font-semibold text-slate-900">
                {filters.startDate
                  ? format(new Date(filters.startDate), "MMM dd")
                  : "Start"}
                {" - "}
                {filters.endDate
                  ? format(new Date(filters.endDate), "MMM dd")
                  : "End"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
                onClick={() => onFilterChange({ startDate: "", endDate: "" })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs text-slate-500 hover:text-red-600 px-2"
            onClick={handleClearFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
