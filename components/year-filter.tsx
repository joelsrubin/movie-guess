"use client";

import { ChevronDown, ChevronUp, Trash } from "lucide-react";
import { useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface YearFilterProps {
	availableYears: number[];
	selectedYears: number[];
	onYearsChange: (years: number[]) => void;
	error: string;
	setErrors: React.Dispatch<
		React.SetStateAction<{ genre: string; year: string }>
	>;
}

export function YearFilter({
	availableYears,
	selectedYears,
	onYearsChange,
	error,
	setErrors,
}: YearFilterProps) {
	const [expandedDecade, setExpandedDecade] = useState<number | null>(null);

	const currentYear = new Date().getFullYear();
	const oldestYear = Math.min(...availableYears);
	const startDecade = Math.floor(oldestYear / 10) * 10;
	const endDecade = Math.floor(currentYear / 10) * 10;

	const decades = Array.from(
		{ length: (endDecade - startDecade) / 10 + 1 },
		(_, i) => endDecade - i * 10,
	);

	const getYearsInDecade = (decade: number) => {
		const decadeYears = [];
		for (let year = decade + 9; year >= decade; year--) {
			if (availableYears.includes(year)) {
				decadeYears.push(year);
			}
		}
		return decadeYears;
	};

	const isDecadeFullySelected = (decade: number) => {
		const decadeYears = getYearsInDecade(decade);
		return (
			decadeYears.length > 0 &&
			decadeYears.every((year) => selectedYears.includes(year))
		);
	};

	const isDecadePartiallySelected = (decade: number) => {
		const decadeYears = getYearsInDecade(decade);
		return (
			decadeYears.some((year) => selectedYears.includes(year)) &&
			!isDecadeFullySelected(decade)
		);
	};

	const toggleDecade = (decade: number) => {
		setErrors((prev) => ({ ...prev, year: "" }));
		const decadeYears = getYearsInDecade(decade);

		if (isDecadeFullySelected(decade)) {
			onYearsChange(selectedYears.filter((y) => !decadeYears.includes(y)));
		} else {
			const newYears = [...new Set([...selectedYears, ...decadeYears])];
			onYearsChange(newYears);
		}
	};

	const toggleYear = (year: number) => {
		setErrors((prev) => ({ ...prev, year: "" }));
		if (selectedYears.includes(year)) {
			onYearsChange(selectedYears.filter((y) => y !== year));
		} else {
			onYearsChange([...selectedYears, year]);
		}
	};

	const toggleExpand = (decade: number) => {
		setExpandedDecade(expandedDecade === decade ? null : decade);
	};

	const clearAll = () => {
		onYearsChange([]);
		setExpandedDecade(null);
	};

	return (
		<div className="space-y-4">
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="years">
					<AccordionTrigger>
						{" "}
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">Filter by Year</h3>
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<div className="space-y-3">
							<div className="flex flex-row flex-wrap">
								{decades.map((decade) => {
									const decadeYears = getYearsInDecade(decade);
									const isExpanded = expandedDecade === decade;
									const isFullySelected = isDecadeFullySelected(decade);
									const isPartiallySelected = isDecadePartiallySelected(decade);

									return (
										<div key={decade} className="flex items-center gap-2">
											<Badge
												variant={isFullySelected ? "default" : "outline"}
												className={`cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 ${
													isFullySelected
														? "bg-primary text-primary-foreground hover:bg-primary/90"
														: isPartiallySelected
															? "bg-primary/50 text-primary-foreground hover:bg-primary/60"
															: "hover:bg-secondary"
												}`}
												onClick={() => toggleDecade(decade)}
											>
												{decade}s{" "}
												{isPartiallySelected && !isFullySelected ? "•" : ""}
											</Badge>

											{decadeYears.length > 0 && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => toggleExpand(decade)}
													className="h-8 w-8 p-0"
												>
													{isExpanded ? (
														<ChevronUp className="h-4 w-4" />
													) : (
														<ChevronDown className="h-4 w-4" />
													)}
												</Button>
											)}
										</div>
									);
								})}
								{selectedYears.length > 0 && (
									<Trash
										className="w-4 self-center h-4 mr-1 hover:cursor-pointer"
										onClick={clearAll}
									/>
								)}
							</div>

							{expandedDecade !== null && (
								<div className="flex flex-row flex-wrap gap-2 ml-4 pl-4 border-l-2 border-border">
									{getYearsInDecade(expandedDecade).map((year) => {
										const isSelected = selectedYears.includes(year);
										return (
											<Badge
												key={year}
												variant={isSelected ? "default" : "outline"}
												className={`cursor-pointer px-3 py-1 text-xs transition-all hover:scale-105 ${
													isSelected
														? "bg-primary text-primary-foreground hover:bg-primary/90"
														: "hover:bg-secondary"
												}`}
												onClick={() => toggleYear(year)}
											>
												{year}
											</Badge>
										);
									})}
								</div>
							)}
						</div>

						{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
