import { Fragment } from 'react';
import styled from '@emotion/styled';
import { NextUITheme, useTheme } from '@nextui-org/react';

import type { Project } from '../../../_content/Work-Experience';
import Li from '../Li';
import TitleTooltip from '../TitleTooltip';

function Project({ title, description, startDate, endDate, which, techStack }: Project) {
  const { theme } = useTheme();

  return (
    <Div>
      <TitleTooltip {...title} />
      <small>
        {startDate} ~ {endDate}
      </small>
      <span>{description}</span>
      {which.length > 0 && (
        <div>
          {which.map((each, index) => (
            <Fragment key={index}>
              <ul data-testid="which wrapper">
                <h4 style={{ marginLeft: '-1.25rem' }}>{each.title}</h4>
                {each.content?.map((content, contentIdx) => (
                  <div key={contentIdx}>
                    <Fragment>
                      <Li theme={theme} dangerouslySetInnerHTML={{ __html: content.main }} />
                      {content.sub &&
                        content.sub.map((sub, subIdx) => (
                          <Li
                            style={{ marginLeft: '1.5rem' }}
                            key={subIdx}
                            theme={theme}
                            dangerouslySetInnerHTML={{ __html: sub }}
                          />
                        ))}
                    </Fragment>
                  </div>
                ))}
              </ul>
            </Fragment>
          ))}
        </div>
      )}

      {techStack && techStack.length > 0 && (
        <TechDiv data-testid="tech stack wrapper">
          {techStack.map((tech, index) => (
            <TechSpan key={index} theme={theme}>
              {tech}
            </TechSpan>
          ))}
        </TechDiv>
      )}
    </Div>
  );
}

export default Project;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
`;

const TechDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TechSpan = styled.span<{ theme: NextUITheme | undefined }>`
  padding: 0.125rem 0.5rem;
  background-color: ${({ theme }) => theme.colors.accents1.value};
  border-radius: 32px;
  font-size: 0.75rem;
  transition: background-color 0.4s, color 0.3s;
`;
