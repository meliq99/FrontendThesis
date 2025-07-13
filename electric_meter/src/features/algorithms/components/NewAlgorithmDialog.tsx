import { useState, useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCreateAlgorithm, useUpdateAlgorithm } from "../hooks/mutations";
import { materialDark } from "@uiw/codemirror-theme-material";
import { ScheduleEditor } from "./ScheduleEditor";
import type { Algorithm } from "../hooks/queries";

const algorithmSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	algorithm_type: z.string().min(1, "Algorithm type is required"),
	script: z.string().min(1, "Script is required"),
});

type AlgorithmFormData = z.infer<typeof algorithmSchema>;

interface NewAlgorithmDialogProps {
	isEditMode?: boolean;
	editAlgorithm?: Algorithm | null;
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	trigger?: React.ReactNode;
	onUpdateSuccess?: () => void;
}

export const NewAlgorithmDialog = ({
	isEditMode = false,
	editAlgorithm,
	isOpen: controlledOpen,
	onOpenChange: controlledOnOpenChange,
	trigger,
	onUpdateSuccess,
}: NewAlgorithmDialogProps) => {
	const [internalOpen, setInternalOpen] = useState(false);
	const { mutate: createAlgorithm, isPending: isCreating } = useCreateAlgorithm();
	const { mutate: updateAlgorithm, isPending: isUpdating } = useUpdateAlgorithm();

	const isControlled = controlledOpen !== undefined && controlledOnOpenChange !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;
	const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen;
	
	const lastProgrammaticScript = useRef<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm<AlgorithmFormData>({
		resolver: zodResolver(algorithmSchema),
		defaultValues: {
			name: editAlgorithm?.name || "",
			description: editAlgorithm?.description || "",
			algorithm_type: editAlgorithm?.algorithm_type || "",
			script: editAlgorithm?.script || "",
		},
	});

	const algorithmType = watch("algorithm_type");
	const scriptValue = watch("script");

	// Schedule state for active algorithm, in seconds
	const [schedule, setSchedule] = useState<[number, number][]>([[3600, 7200]]);

	// Generate script based on algorithm type and schedule
	const generateScript = useCallback((scheduleData: [number, number][]) => {
		const scheduleStr = JSON.stringify(scheduleData);
		return `def simulate(current_time, base_consumption, _, __, ___, extra_params):
    schedule = extra_params.get('schedule', ${scheduleStr})
    day_time = current_time % 86400
    for start, end in schedule:
        if start <= day_time < end:
            return base_consumption
    # modo standby muy bajo
    return 10`;
	}, []);

	// Update script when schedule changes
	const handleScheduleChange = useCallback((newSchedule: [number, number][]) => {
		setSchedule(newSchedule);
		if (algorithmType === "active") {
			const newScript = generateScript(newSchedule);
			setValue("script", newScript);
			lastProgrammaticScript.current = newScript;
		}
	}, [algorithmType, setValue, generateScript]);
	
	const parseScheduleFromScript = (script: string): [number, number][] | null => {
		try {
			const match = script.match(/schedule = extra_params\.get\('schedule', (\[.*?\])\)/);
			if (match && match[1]) {
				const parsed = JSON.parse(match[1]);
				// Basic validation
				if (Array.isArray(parsed) && parsed.every(p => Array.isArray(p) && p.length === 2 && typeof p[0] === 'number' && typeof p[1] === 'number')) {
					return parsed;
				}
			}
		} catch (e) {
			return null;
		}
		return null;
	}

	const onSubmit = useCallback((data: AlgorithmFormData) => {
		if (isEditMode && editAlgorithm) {
			updateAlgorithm(
				{ ...data, id: editAlgorithm.id },
				{
					onSuccess: () => {
						console.log("Algorithm updated successfully");
						reset();
						setOpen(false);
						onUpdateSuccess?.();
					},
					onError: (error) => {
						console.error("Failed to update algorithm:", error);
					},
				}
			);
		} else {
			createAlgorithm(data, {
				onSuccess: () => {
					console.log("Algorithm created successfully");
					reset();
					setOpen(false);
				},
				onError: (error) => {
					console.error("Failed to create algorithm:", error);
				},
			});
		}
	}, [isEditMode, editAlgorithm, updateAlgorithm, createAlgorithm, reset, setOpen, onUpdateSuccess]);

	const handleCancel = useCallback(() => {
		reset();
		setSchedule([[3600, 7200]]);
		setOpen(false);
	}, [reset, setOpen]);

	// Reset form when opening dialog or changing edit algorithm
	useEffect(() => {
		if (open) {
			const initialScript = editAlgorithm?.script || generateScript([[3600, 7200]]);
			const initialSchedule = parseScheduleFromScript(initialScript) || [[3600, 7200]];
			
			reset({
				name: editAlgorithm?.name || "",
				description: editAlgorithm?.description || "",
				algorithm_type: editAlgorithm?.algorithm_type || "active",
				script: initialScript,
			});
			setSchedule(initialSchedule);
			lastProgrammaticScript.current = initialScript;
		}
	}, [open, editAlgorithm, reset, generateScript]);

	const handleAlgorithmTypeChange = useCallback((value: string) => {
		setValue("algorithm_type", value);
		if (value === 'active') {
			const newScript = generateScript(schedule);
			setValue("script", newScript);
			lastProgrammaticScript.current = newScript;
		}
	}, [setValue, schedule, generateScript]);

	const handleScriptChange = useCallback((value: string) => {
		setValue("script", value);
		// If this change wasn't from the schedule editor, try to parse it
		if (value !== lastProgrammaticScript.current) {
			const parsedSchedule = parseScheduleFromScript(value);
			if (parsedSchedule) {
				setSchedule(parsedSchedule);
			}
		}
	}, [setValue]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{isEditMode ? "Edit Algorithm" : "Create New Algorithm"}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								{...register("name")}
								placeholder="Algorithm name"
								className={errors.name ? "border-red-500" : ""}
							/>
							{errors.name && (
								<p className="text-sm text-red-600">{errors.name.message}</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="algorithm_type">Algorithm Type</Label>
							<Select value={algorithmType} onValueChange={handleAlgorithmTypeChange}>
								<SelectTrigger className={errors.algorithm_type ? "border-red-500" : ""}>
									<SelectValue placeholder="Select algorithm type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="cyclic">Cyclic</SelectItem>
									<SelectItem value="random">Random</SelectItem>
									<SelectItem value="linear">Linear</SelectItem>
									<SelectItem value="exponential">Exponential</SelectItem>
									<SelectItem value="custom">Custom</SelectItem>
								</SelectContent>
							</Select>
							{errors.algorithm_type && (
								<p className="text-sm text-red-600">{errors.algorithm_type.message}</p>
							)}
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Input
							id="description"
							{...register("description")}
							placeholder="Algorithm description"
							className={errors.description ? "border-red-500" : ""}
						/>
						{errors.description && (
							<p className="text-sm text-red-600">{errors.description.message}</p>
						)}
					</div>
					
					{/* Schedule Editor for Active Algorithm */}
					{algorithmType === "active" && (
						<div className="space-y-2">
							<ScheduleEditor
								schedule={schedule}
								onScheduleChange={handleScheduleChange}
							/>
						</div>
					)}
					
					<div className="space-y-2">
						<Label htmlFor="script">Script</Label>
						<div className={`border rounded-md ${errors.script ? "border-red-500" : "border-gray-300"}`}>
							<CodeMirror
								value={scriptValue}
								height="300px"
								placeholder="Enter your algorithm script here..."
								onChange={handleScriptChange}
								theme={materialDark}
								basicSetup={{
									lineNumbers: true,
									highlightActiveLineGutter: true,
									highlightSpecialChars: true,
									history: true,
									foldGutter: true,
									drawSelection: true,
									dropCursor: true,
									allowMultipleSelections: true,
									indentOnInput: true,
									bracketMatching: true,
									closeBrackets: true,
									autocompletion: true,
									highlightActiveLine: true,
									highlightSelectionMatches: true,
								}}
								extensions={[python()]}
							/>
						</div>
						{errors.script && (
							<p className="text-sm text-red-600">{errors.script.message}</p>
						)}
					</div>
					<div className="flex justify-end gap-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							disabled={isCreating || isUpdating}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isCreating || isUpdating}
							className="bg-indigo-600 hover:bg-indigo-700"
						>
							{isCreating || isUpdating ? "Saving..." : isEditMode ? "Update Algorithm" : "Create Algorithm"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}; 