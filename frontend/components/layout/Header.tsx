import React from 'react';
import Head from 'next/head';
import Script from 'next/script';

// import FileUpload from '/components/FileUpload';

export default function Header() {
  return (
    <>
      <Head>
        <title>Corporate Intelligence</title>
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/fonts/phosphor/duotone/style.css" />
        <link rel="stylesheet" href="/assets/fonts/tabler-icons.min.css" />
        <link rel="stylesheet" href="/assets/fonts/feather.css" />
        <link rel="stylesheet" href="/assets/fonts/fontawesome.css" />
        <link rel="stylesheet" href="/assets/fonts/material.css" />
        <link rel="stylesheet" href="/assets/css/style.css" id="main-style-link" />
        <link rel="stylesheet" href="/assets/app.css" />

        <Script src="/assets/js/plugins/simplebar.min.js"/>
        <Script src="/assets/js/plugins/popper.min.js"/>
        <Script src="/assets/js/icon/custom-icon.js"/>
        <Script src="/assets/js/plugins/feather.min.js"/>
        <Script src="/assets/js/component.js"/>
        <Script src="/assets/js/theme.js"/>
        <Script src="/assets/js/script.js"/>
      </Head>
    </>
  );
} 