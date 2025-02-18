import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import _generate from '@babel/generator'
import * as parser from '@babel/parser'
import _traverse, { type NodePath } from '@babel/traverse'
import {
	type ImportDeclaration,
	type MemberExpression,
	type CallExpression,
	type File,
	type Expression,
	type ObjectProperty,
	stringLiteral,
	templateLiteral,
	templateElement,
	identifier,
} from '@babel/types'
import chalk from 'chalk'
import { glob } from 'glob'

// @ts-expect-error - traverse has incorrect types in ESM
const traverse = _traverse.default || _traverse
// @ts-expect-error - generator has incorrect types in ESM
const generate = _generate.default || _generate

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read and parse en.json
const enJsonPath = resolve(__dirname, '../messages/en.json')
const translations = JSON.parse(readFileSync(enJsonPath, 'utf-8'))

interface TranslationUsage {
	key: string
	value: string
	line: number
	column: number
	type: 'function' | 'property' | 'unknown'
	parameters: string[]
	node: MemberExpression
	parent?: CallExpression
}

// Split a string into parts, keeping the delimiters
function splitWithDelimiters(str: string, delimiter: RegExp) {
	const parts: string[] = []
	let lastIndex = 0
	let match

	while ((match = delimiter.exec(str)) !== null) {
		// Add the text before the match
		if (match.index > lastIndex) {
			parts.push(str.slice(lastIndex, match.index))
		}
		// Add the match itself
		parts.push(match[0])
		lastIndex = match.index + match[0].length
	}

	// Add any remaining text
	if (lastIndex < str.length) {
		parts.push(str.slice(lastIndex))
	}

	return parts
}

// Generate replacement code for a translation
function generateReplacement(usage: TranslationUsage) {
	const { value, parameters } = usage

	// If it's a plain string in JSX context, return a string literal
	if (parameters.length === 0) {
		return stringLiteral(value)
	}

	// Split the string into parts, keeping the delimiters
	const parts = splitWithDelimiters(value, /\{([^}]+)\}/)

	// Create template elements and expressions
	const quasis = []
	const expressions = []
	let isParam = false

	for (const part of parts) {
		if (part.startsWith('{') && part.endsWith('}')) {
			// This is a parameter
			const paramName = part.slice(1, -1)
			expressions.push(identifier(paramName))
			isParam = true
		} else {
			quasis.push(
				templateElement(
					{ raw: part, cooked: part },
					!isParam && quasis.length === parts.length - 1,
				),
			)
			isParam = false
		}
	}

	// Add final quasi if needed
	if (isParam) {
		quasis.push(templateElement({ raw: '', cooked: '' }, true))
	}

	return templateLiteral(quasis, expressions)
}

// Process a single file and save changes immediately
async function processFile(filePath: string) {
	try {
		console.log(chalk.blue('\nProcessing:'), chalk.white(filePath))
		const content = readFileSync(filePath, 'utf-8')

		// Parse the file
		const ast = parser.parse(content, {
			sourceType: 'module',
			plugins: ['typescript', 'jsx'],
		}) as unknown as File

		// Find the import name
		let importName: string | null = null
		traverse(ast, {
			ImportDeclaration(path: NodePath<ImportDeclaration>) {
				if (path.node.source.value === '@/lib/paraglide/messages') {
					const specifier = path.node.specifiers[0]
					if (specifier?.type === 'ImportNamespaceSpecifier') {
						importName = specifier.local.name
					} else if (specifier?.type === 'ImportDefaultSpecifier') {
						importName = specifier.local.name
					}
				}
			},
		})

		if (!importName) {
			return { hasTranslations: false, count: 0 }
		}

		// Find and replace translations
		let translationCount = 0
		let modified = false

		traverse(ast, {
			MemberExpression(path: NodePath<MemberExpression>) {
				if (
					path.node.object.type === 'Identifier' &&
					path.node.object.name === importName &&
					path.node.property.type === 'Identifier'
				) {
					const key = path.node.property.name
					const value = translations[key]
					if (!value) return

					translationCount++
					console.log(
						chalk.yellow(`  Found translation:`),
						chalk.cyan(key),
						'→',
						chalk.white(value),
					)

					const parent = path.parent
					const isFunction = parent.type === 'CallExpression'

					if (isFunction) {
						const params = (parent as CallExpression).arguments[0]
						if (params?.type === 'ObjectExpression') {
							// Handle parameterized string with template literal
							const paramValues = params.properties
								.filter((p): p is ObjectProperty => p.type === 'ObjectProperty')
								.reduce(
									(acc, prop) => {
										if (prop.key.type === 'Identifier') {
											acc[prop.key.name] = prop.value as Expression
										}
										return acc
									},
									{} as Record<string, Expression>,
								)

							// Split the string into parts, keeping the delimiters
							const parts = value.split(/(\{[^}]+\})/)
							const quasis = []
							const expressions = []

							// Process each part and ensure proper quasis
							for (let i = 0; i < parts.length; i++) {
								const part = parts[i]
								if (part.startsWith('{') && part.endsWith('}')) {
									// This is a parameter
									const paramName = part.slice(1, -1)
									expressions.push(
										paramValues[paramName] || identifier(paramName),
									)

									// Add empty quasi if this is the last part
									if (i === parts.length - 1) {
										quasis.push(templateElement({ raw: '', cooked: '' }, true))
									}
								} else {
									// This is a text part
									quasis.push(
										templateElement(
											{ raw: part, cooked: part },
											i === parts.length - 1 && !parts[i + 1]?.startsWith('{'),
										),
									)
								}
							}

							path.parentPath?.replaceWith(templateLiteral(quasis, expressions))
						} else {
							// Non-parameterized function call
							const replacement = generateReplacement({
								key,
								value,
								parameters: [],
								node: path.node,
								line: path.node.loc?.start.line ?? 0,
								column: path.node.loc?.start.column ?? 0,
								type: 'function',
								parent: parent as CallExpression,
							})
							if (typeof replacement === 'string') {
								// For JSX contexts with plain strings
								path.parentPath?.replaceWith({
									type: 'JSXText',
									value: replacement,
								})
							} else {
								path.parentPath?.replaceWith(replacement)
							}
						}
					} else {
						// Simple property access
						const replacement = generateReplacement({
							key,
							value,
							parameters: [],
							node: path.node,
							line: path.node.loc?.start.line ?? 0,
							column: path.node.loc?.start.column ?? 0,
							type: 'property',
						})
						if (typeof replacement === 'string') {
							// For JSX contexts with plain strings
							path.replaceWith({
								type: 'JSXText',
								value: replacement,
							})
						} else {
							path.replaceWith(replacement)
						}
					}
					modified = true
				}
			},
		})

		if (modified) {
			// Remove the import if we modified anything
			traverse(ast, {
				ImportDeclaration(path: NodePath<ImportDeclaration>) {
					if (path.node.source.value === '@/lib/paraglide/messages') {
						path.remove()
					}
				},
			})

			// Generate and save the modified code
			const output = generate(ast, {
				retainLines: false,
				jsescOption: { minimal: true },
			}).code

			writeFileSync(filePath, output)
			console.log(chalk.green('  ✓ File updated successfully'))
		}

		return { hasTranslations: translationCount > 0, count: translationCount }
	} catch (error) {
		console.error(
			chalk.red(`Error processing ${filePath}:`),
			error instanceof Error ? error.message : String(error),
		)
		return { hasTranslations: false, count: 0 }
	}
}

// Main function to process all files
async function main() {
	const sourceFiles = glob.sync('src/**/*.{ts,tsx}', {
		cwd: resolve(__dirname, '..'),
		ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'],
	})

	console.log(chalk.blue('\nStarting translation replacement:'))
	console.log(`Total files to check: ${chalk.white(sourceFiles.length)}`)

	let filesWithTranslations = 0
	let totalTranslations = 0
	let filesProcessed = 0

	for (const file of sourceFiles) {
		const filePath = resolve(__dirname, '..', file)
		filesProcessed++

		const result = await processFile(filePath)

		if (result.hasTranslations) {
			filesWithTranslations++
			totalTranslations += result.count
		}

		// Progress update
		const percent = Math.round((filesProcessed / sourceFiles.length) * 100)
		console.log(
			chalk.blue(
				`\nProgress: ${percent}% (${filesProcessed}/${sourceFiles.length})`,
			),
		)
	}

	// Print final summary
	console.log('\n' + chalk.blue('─'.repeat(80)))
	console.log(chalk.blue('\nFinal Summary:'))
	console.log(chalk.white(`Total files processed: ${filesProcessed}`))
	console.log(chalk.green(`Files with translations: ${filesWithTranslations}`))
	console.log(chalk.green(`Total translations replaced: ${totalTranslations}`))
	console.log('\n' + chalk.blue('─'.repeat(80)))
}

// Run the script
main().catch((error) => {
	console.error(chalk.red('\nScript failed:'), error)
	process.exit(1)
})
