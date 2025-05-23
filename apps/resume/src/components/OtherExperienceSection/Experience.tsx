import { Fragment } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@nextui-org/react';

import type { Experience } from '../../../_content/Other-Experience';
import Li from '../Li';
import TitleTooltip from '../TitleTooltip';

function Experience({ title, position, startDate, endDate, description, which }: Experience) {
  const { theme } = useTheme();

  return (
    <Div>
      <TitleTooltip {...title} />
      <small>
        {startDate} ~ {endDate}
      </small>
      <span>{position}</span>
      <p>{description}</p>
      {which.length > 0 && (
        <ul>
          {which.map((each, index) => (
            <Fragment key={index}>
              <Li theme={theme} dangerouslySetInnerHTML={{ __html: each.main }}></Li>
              {each.sub &&
                each.sub.map((sub, subIdx) => (
                  <Li
                    style={{ marginLeft: '1.5rem' }}
                    key={subIdx}
                    theme={theme}
                    dangerouslySetInnerHTML={{ __html: sub }}
                  />
                ))}
            </Fragment>
          ))}
        </ul>
      )}
    </Div>
  );
}

export default Experience;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`;
