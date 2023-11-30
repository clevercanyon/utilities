/**
 * Starry Night header extensions.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * @note This entire file will be updated automatically.
 * @note Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 */

export default [
    (await import('@microflash/rehype-starry-night/header-caption-extension')).default,
    (await import('@microflash/rehype-starry-night/header-language-extension')).default,
    (headerOptions, children) => {
        children.push({
            type: 'element',
            tagName: 'button',
            properties: {
                tabIndex: -1,
                'aria-label': 'Copy to Clipboard',

                dataCopied: null,
                dataCopyId: headerOptions.id,
                className: ['highlight-copy text-sm text-right link no-underline active:scale-90'],
            },
            children: [
                {
                    type: 'text',
                    value: 'copy',
                },
            ],
        });
    },
];
