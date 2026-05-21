import styled from '@emotion/styled';
import { NextUITheme, useTheme } from '@nextui-org/react';
import { PageProgressBar } from 'core';

import AuthorSection from '../components/AuthorSection';
import Comments from '../components/Comments';
import DateAndCategoryLink from '../components/DateAndCategoryLink';
import { PostHeader } from '../components/Header';
import SEO from '../components/SEO';
import TOC from '../components/TOC';
import { getAllPosts } from '../libs/api';
import markdownToHtml from '../libs/markdownToHtml';

interface Props {
  title: string;
  subtitle: string;
  category: string;
  date: string;
  content: string;
  ogImage: string | null;
}

function Post({ title, subtitle, category, date, content, ogImage }: Props) {
  const { theme } = useTheme();

  return (
    <>
      <SEO title={title} description={subtitle} ogImage={ogImage} />
      <PostHeader />
      <TOC />
      <Main>
        <H1>{title}</H1>
        <P theme={theme}>
          <DateAndCategoryLink date={date} category={category} />
        </P>
        <Article dangerouslySetInnerHTML={{ __html: content }}></Article>
      </Main>
      <AuthorSection hasKbarButton />
      <Comments />
      <PageProgressBar />
    </>
  );
}

export default Post;

const Main = styled.main`
  position: relative;
  margin-bottom: 3rem;
`;

const H1 = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 5vw, 2.5rem);
  line-height: 1.25;
`;

const P = styled.p<{ theme: NextUITheme | undefined }>`
  margin-top: 0;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.accents6.value};
`;

const Article = styled.article`
  overflow-x: auto;

  & h1,
  & h2 {
    margin-top: 2rem;
  }

  & h3,
  & h4,
  & h5,
  & h6 {
    margin-top: 1rem;
  }

  & img {
    margin-top: 0.75rem;
  }

  & hr {
    margin: 1.5rem 0;
  }

  & table {
    width: 100%;
    min-width: 100%;
    margin: 1rem 0 1.5rem;
    border-collapse: collapse;
    table-layout: auto;
    font-size: 0.95rem;
  }

  & th,
  & td {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--nextui-colors-border);
    text-align: left;
    white-space: nowrap;
  }

  & th {
    background-color: var(--nextui-colors-accents1);
    font-weight: 600;
  }

  & tbody tr:nth-of-type(even) {
    background-color: var(--nextui-colors-accents0);
  }

  & p,
  & li {
    text-align: justify;
    text-justify: inter-word;
  }

  & p {
    margin-bottom: 0.25rem;
  }

  & blockquote p:last-of-type {
    margin-bottom: 0;
  }
`;

interface Paths {
  params: {
    slug: string;
  };
}

export async function getStaticPaths() {
  const allPosts = getAllPosts(['slug']);

  const paths: Paths[] = [];
  allPosts.map(post => paths.push({ params: { slug: post.slug } }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  const allPosts = getAllPosts(['title', 'subtitle', 'date', 'category', 'content', 'slug']);
  const currentPost = allPosts.filter(post => post.slug === slug)[0];
  if (typeof currentPost === 'undefined') {
    return { notFound: true };
  }

  const content = await markdownToHtml(currentPost.content);
  const firstImageSrc = getFirstImageSrc(content);

  return {
    props: {
      title: currentPost.title,
      subtitle: currentPost.subtitle ?? null,
      category: currentPost.category,
      date: currentPost.date,
      content,
      ogImage: firstImageSrc,
    },
  };
}

function getFirstImageSrc(content: string): string | null {
  try {
    const tags = content.split('<');

    const firstImageTag = tags.find(tag => {
      const attrs = tag.split(' ');
      return attrs[0] === 'img';
    });

    const attrs = firstImageTag.split(' ');
    const srcAttr = attrs.find(attr => attr.slice(0, 3) === 'src');
    const srcValue = srcAttr.slice(4, -1).replace(/"/gi, '');
    return srcValue;
  } catch {
    return null;
  }
}
