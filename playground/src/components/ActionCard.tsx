import type { ReactNode } from 'react'

type ActionCardProps = {
	eyebrow: string
	title: string
	copy: string
	children: ReactNode
}

export function ActionCard({ eyebrow, title, copy, children }: ActionCardProps) {
	return (
		<div className="action-card">
			<div className="action-head">
				<p className="eyebrow">{eyebrow}</p>
				<h4>{title}</h4>
				<p className="panel-copy">{copy}</p>
			</div>
			<div className="action-body">{children}</div>
		</div>
	)
}
