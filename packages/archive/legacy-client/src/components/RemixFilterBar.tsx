import { useState } from "react";

interface FilterState {
  search: string;
  emotion: string;
  category: string;
  health: string;
}

interface RemixFilterBarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

export function RemixFilterBar({ filters, setFilters }: RemixFilterBarProps) {
  return (
    <div className="w-full bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-md flex flex-wrap gap-4 items-center justify-between border border-white/20">
      <input
        type="text"
        placeholder="Search dreams..."
        className="p-2 rounded-lg bg-white/5 text-white w-full sm:w-1/3"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />
      <select
        className="p-2 rounded-lg bg-white/5 text-white"
        value={filters.emotion}
        onChange={(e) => setFilters({ ...filters, emotion: e.target.value })}
      >
        <option value="">All Emotions</option>
        <option value="joy">Joy</option>
        <option value="hope">Hope</option>
        <option value="ambition">Ambition</option>
        <option value="curiosity">Curiosity</option>
        <option value="sadness">Sadness</option>
        <option value="fear">Fear</option>
        <option value="chaos">Chaos</option>
        <option value="love">Love</option>
      </select>
      <select
        className="p-2 rounded-lg bg-white/5 text-white"
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        <option value="">All Categories</option>
        <option value="Parody">Parody</option>
        <option value="Enhance">Enhance</option>
        <option value="Reimagine">Reimagine</option>
        <option value="Fusion">Fusion</option>
      </select>
      <select
        className="p-2 rounded-lg bg-white/5 text-white"
        value={filters.health}
        onChange={(e) => setFilters({ ...filters, health: e.target.value })}
      >
        <option value="">All Health Levels</option>
        <option value="1">💀 Low</option>
        <option value="2">⚠️ Fair</option>
        <option value="3">💫 Moderate</option>
        <option value="4">🌱 Healthy</option>
        <option value="5">🌈 Vibrant</option>
      </select>
    </div>
  );
}