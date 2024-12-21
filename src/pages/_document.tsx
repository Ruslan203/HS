import React from "react";
import NextDocument, {
    DocumentContext,
    DocumentInitialProps,
    Head,
    Html,
    Main,
    NextScript
} from "next/document";
import {ServerStyleSheet} from "styled-components";
import {PortalContainer} from "@common/Portal/Container";
import {YandexMetrika} from "@common/YandexMetrika";

export default class Document extends NextDocument {
    public static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />)
                });

            let initialProps: DocumentInitialProps = await NextDocument.getInitialProps(ctx);
            initialProps = {
                ...initialProps,
                styles: [initialProps.styles, sheet.getStyleElement()]
            };

            return initialProps;
        } finally {
            sheet.seal();
        }
    }

    public render(): React.ReactElement {
        return (
            <Html lang="ru">
                <Head />
                <body>
                    <Main />
                    <PortalContainer />
                    <NextScript />
                    <YandexMetrika />
                </body>
            </Html>
        );
    }
}
