import React from 'react';
import App, { Container } from 'next/app';
class ExampleApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
          <Component {...pageProps} />
      </Container>
    );
  }
}

export default ExampleApp;