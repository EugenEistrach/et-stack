import { createContext, useContext } from 'react'

const ThemeContext = createContext<'light' | 'dark'>('light')

const ThemeProvider = ({
	children,
	theme,
}: {
	children: React.ReactNode
	theme: 'light' | 'dark'
}) => {
	return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

const useTheme = () => {
	const theme = useContext(ThemeContext)
	if (!theme) {
		throw new Error('ThemeProvider not found')
	}
	return theme
}

const useInvertedTheme = () => {
	const theme = useTheme()
	return theme === 'light' ? 'dark' : 'light'
}

export { ThemeProvider, useTheme, useInvertedTheme }
