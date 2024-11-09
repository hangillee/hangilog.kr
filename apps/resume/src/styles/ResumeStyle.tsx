import { css, Global } from '@emotion/react';
import { config } from '@nextui-org/react';

const resumeStyle = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    font-size: 15px;
    word-break: keep-all;
    word-wrap: break-word;
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    transition: background-color 0.4s, color 0.3s;
  }

  ul,
  ol {
    color: inherit;
  }

  ul:not(.contains-task-list) {
    list-style-type: disc;
  }

  li {
    margin: 0;
  }

  small {
    margin-bottom: 8px;
  }

  a {
    text-decoration: underline;
    color: #6db33f;
  }

  @media ${config.media.xsMax} {
    html {
      font-size: 13px;
    }
  }
`;

export const ResumeStyle = () => {
  return <Global styles={resumeStyle} />;
};
