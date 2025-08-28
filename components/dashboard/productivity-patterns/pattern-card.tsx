interface PatternCardProps {
	title: React.ReactNode;
	icon: React.ReactNode;
	description: React.ReactNode;
}
export default function PatternCard({ title, icon, description }: PatternCardProps) {
	return (<div className="flex gap-2.5">
		<div className="flex items-center p-2 h-fit bg-muted text-muted-foreground">
			{icon}
		</div>
		<div className="mb-1 flex flex-col">
			<span className="text-xs text-muted-foreground">{title}</span>
			<span className="text-sm font-medium">{description}</span>
		</div>
	</div>
	)
}
