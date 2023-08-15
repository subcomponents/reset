// --------------------------------
// playground generator
// --------------------------------

/**
 * Convert string to html
 * @param {String} inputString
 * @returns {DocumentFragment}
 */
function html(inputString = ``) {
	const template = document.createElement('template')
	template.innerHTML = inputString.trim()
	return template.content.cloneNode(true)
}

const createPlayground = (content) => {
	const playgroundTemplate = `
		<link rel="stylesheet" href="reset.min.css">
		<link rel="stylesheet" href="grid.min.css">
		<link rel="stylesheet" href="properties.min.css">
		<style>
			:host {
				display: block;
				width: 100%;
			}
		</style>
		<div class="playground border border-radius-0.3 margin-bottom-1 box-shadow">
			<div class="playground-toolbar border-bottom-1 padding-1 box-shadow">
				<button type="button" class="font-size-small bg-transparent color-default" data-action="viewport-desktop"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> Desktop</button>
				<button type="button" class="font-size-small bg-transparent color-default" data-action="viewport-tablet"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg> Tablet</button>
				<button type="button" class="font-size-small bg-transparent color-default" data-action="viewport-mobile"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg> Mobile</button>
				<button type="button" class="font-size-small bg-transparent color-default" data-action="dark-mode"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> Dark</button>
				<button type="button" class="font-size-small bg-transparent color-default" data-action="css-background"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg> Background</button>
				<button type="button" class="font-size-small bg-transparent color-default" data-action="css-brand"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="10"></circle></svg> Branding</button>
				<button type="button" class="font-size-small bg-transparent color-default" data-action="css-debug"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg> Debug</button>
			</div><!-- /.playground-toolbar -->
			<div class="playground-content padding-1 box-shadow">
				<slot></slot>
			</div><!-- /.playground-content -->
		</div><!-- /.playground -->
`
	return html(playgroundTemplate)
}

/**
 * Create playground
 * @returns {DocumentFragment}
 */
class UiPlayground extends HTMLElement {
	constructor() {
		super()
		/**
		 * Create shadow root
		 */
		const shadowRoot = this.attachShadow({ mode: 'open' })

		/**
		 * Build the template
		 */
		const template = createPlayground()
		shadowRoot.append(template)

		/**
		 * Get elements
		 * - template lives in the shadow root
		 * - slots live in the light DOM
		 */
		const playgroundContent = shadowRoot.querySelector('.playground-content')

		/**
		 * Button: desktop
		 * Action: resize the component to desktop size
		 */
		const buttonDesktop = shadowRoot.querySelector('[data-action="viewport-desktop"]')
		buttonDesktop.addEventListener('click', function (event) {
			playgroundContent.style = ''
		})

		/**
		 * Button: tablet
		 * Action: resize the component to tablet size
		 */
		const buttonTablet = shadowRoot.querySelector('[data-action="viewport-tablet"]')
		buttonTablet.addEventListener('click', function (event) {
			playgroundContent.style = 'width: 768px; margin: 0 auto;'
		})

		/**
		 * Button: mobile
		 * Action: resize the component to mobile size
		 */
		const buttonMobile = shadowRoot.querySelector('[data-action="viewport-mobile"]')
		buttonMobile.addEventListener('click', function (event) {
			playgroundContent.style = 'width: 375px; margin: 0 auto;'
		})
		
		/**
		 * Button: dark mode
		 * Action: toggle dark mode
		 */
		const buttonDark = shadowRoot.querySelector('[data-action="dark-mode"]')
		buttonDark.addEventListener('click', function (event) {
			document.documentElement.classList.toggle('dark-mode')
		})

		/**
		 * Button: background
		 * Action: toggle background color
		 */
		const buttonBackground = shadowRoot.querySelector('[data-action="css-background"]')
		let currentClassIndex = 0;
		buttonBackground.addEventListener('click', function (event) {
			const bgClasses = ['bg-stripes', 'bg-highlight', 'bg-primary', 'bg-black', 'bg-transparent']
			bgClasses.forEach(className => playgroundContent.classList.remove(className))
			playgroundContent.classList.add(bgClasses[currentClassIndex])
			currentClassIndex++;
			if (currentClassIndex === bgClasses.length) currentClassIndex = 0;
		})

		/**
		 * Button: brand
		 * Action: toggle brand color
		 */
		const buttonBrand = shadowRoot.querySelector('[data-action="css-brand"]')
		let currentBrandIndex = 0;
		const brandColors = ['--color-red', '--color-green', '--color-yellow', '--reset']
		buttonBrand.addEventListener('click', function (event) {
			const lastIndex = (brandColors.length - 1);
			if (currentBrandIndex === lastIndex) {
				currentBrandIndex = 0;
				playgroundContent.style.removeProperty('--color-primary')
				playgroundContent.style.removeProperty('--color-primary-light')
			} else {
				currentBrandIndex++;
				playgroundContent.style.setProperty('--color-primary', `var(${brandColors[currentBrandIndex]})`)
				playgroundContent.style.setProperty('--color-primary-light', `var(${brandColors[currentBrandIndex]}-light)`)
			}
		})

		/**
		 * Button: debug
		 * Action: toggle debug mode
		 */
		const buttonDebug = shadowRoot.querySelector('[data-action="css-debug"]')
		buttonDebug.addEventListener('click', function(event) {
			// playgroundContent.classList.toggle('debug')
			// access slot content via `assignedElements`
			shadowRoot.querySelector('slot').assignedElements()[0].classList.toggle('debug')
		})
	}
}

customElements.define('ui-playground', UiPlayground)
