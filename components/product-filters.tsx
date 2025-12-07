"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"

interface FilterProps {
  onFilterChange: (filters: {
    bank?: string
    minAPR?: string
    maxAPR?: string
    minIncome?: string
    minCreditScore?: string
  }) => void
}

export function ProductFilters({ onFilterChange }: FilterProps) {
  const [bank, setBank] = useState("")
  const [minAPR, setMinAPR] = useState("")
  const [maxAPR, setMaxAPR] = useState("")
  const [minIncome, setMinIncome] = useState("")
  const [minCreditScore, setMinCreditScore] = useState("")

  const handleApplyFilters = () => {
    onFilterChange({
      bank: bank || undefined,
      minAPR: minAPR || undefined,
      maxAPR: maxAPR || undefined,
      minIncome: minIncome || undefined,
      minCreditScore: minCreditScore || undefined,
    })
  }

  const handleReset = () => {
    setBank("")
    setMinAPR("")
    setMaxAPR("")
    setMinIncome("")
    setMinCreditScore("")
    onFilterChange({})
  }

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm sticky top-4">
      <CardHeader className="border-b border-slate-200 dark:border-slate-800">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div>
          <Label htmlFor="bank" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
            Bank Name
          </Label>
          <Input
            id="bank"
            placeholder="Search bank..."
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="minAPR" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Min APR (%)
            </Label>
            <Input
              id="minAPR"
              type="number"
              placeholder="0"
              min="0"
              max="30"
              step="0.1"
              value={minAPR}
              onChange={(e) => setMinAPR(e.target.value)}
              className="border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500"
            />
          </div>
          <div>
            <Label htmlFor="maxAPR" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Max APR (%)
            </Label>
            <Input
              id="maxAPR"
              type="number"
              placeholder="30"
              min="0"
              max="30"
              step="0.1"
              value={maxAPR}
              onChange={(e) => setMaxAPR(e.target.value)}
              className="border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="minIncome" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
            Min Annual Income ($)
          </Label>
          <Input
            id="minIncome"
            type="number"
            placeholder="0"
            min="0"
            step="1000"
            value={minIncome}
            onChange={(e) => setMinIncome(e.target.value)}
            className="border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500"
          />
        </div>

        <div>
          <Label htmlFor="minCreditScore" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
            Max Min Credit Score
          </Label>
          <Input
            id="minCreditScore"
            type="number"
            placeholder="850"
            min="300"
            max="850"
            value={minCreditScore}
            onChange={(e) => setMinCreditScore(e.target.value)}
            className="border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500"
          />
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <HoverBorderGradient
            as="button"
            onClick={handleApplyFilters}
            containerClassName="w-full"
            className="w-full bg-slate-900 dark:bg-slate-800 text-white"
          >
            Apply Filters
          </HoverBorderGradient>
          <HoverBorderGradient
            as="button"
            onClick={handleReset}
            containerClassName="w-full"
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          >
            Reset
          </HoverBorderGradient>
        </div>
      </CardContent>
    </Card>
  )
}
