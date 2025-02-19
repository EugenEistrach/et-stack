'use client'

import { Link, isMatch, useMatches } from '@tanstack/react-router'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import React from 'react'

export function Breadcrumbs() {
	const matches = useMatches()

	if (matches.some((match) => match.status === 'pending')) return null

	const breadcrumbs = matches.filter((match) =>
		isMatch(match, 'loaderData.crumb'),
	)

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.flatMap((match, index) => (
					<React.Fragment key={match.fullPath}>
						<BreadcrumbItem>
							{index < breadcrumbs.length - 1 ? (
								<BreadcrumbLink asChild>
									<Link from={match.fullPath}>{match.loaderData?.crumb}</Link>
								</BreadcrumbLink>
							) : (
								<BreadcrumbPage>{match.loaderData?.crumb}</BreadcrumbPage>
							)}
						</BreadcrumbItem>
						{index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
