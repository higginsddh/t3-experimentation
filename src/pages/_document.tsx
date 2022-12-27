import React from "react";
import type { DocumentContext, DocumentInitialProps } from "next/document";
import Document, { Head, Html, Main, NextScript } from "next/document";
import { extractCritical } from "@emotion/server";
import { resetServerContext } from "react-beautiful-dnd";

export default class _Document extends Document {
  // Following example from https://www.codedaily.io/tutorials/Using-react-beautiful-dnd-with-NextJS
  // to preserve styling when using resetServerContext and Emotion styling
  // that mantine uses
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const page = await ctx.renderPage();
    const initialProps = await Document.getInitialProps(ctx);
    const styles = extractCritical(page.html);
    resetServerContext();
    return { ...initialProps, ...page, ...styles };
  }

  render() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyProps = this.props as any;
    return (
      <Html>
        <Head>
          <style
            data-emotion-css={anyProps.ids.join(" ")}
            dangerouslySetInnerHTML={{ __html: anyProps.css }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
