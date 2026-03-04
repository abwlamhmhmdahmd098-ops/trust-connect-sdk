import { FooterLogic } from '@trustwallet/connect-ui-logic'
import { FooterWrapper } from './components/FooterWrapper'
import { FooterDescription } from './components/FooterDescription'
import { FooterLink } from './components/FooterLink'

export function Footer() {
	return (
		<FooterLogic
			components={{
				wrapper: FooterWrapper,
				description: FooterDescription,
				link: FooterLink,
			}}
		/>
	)
}
