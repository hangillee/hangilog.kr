import styled from '@emotion/styled';
import { useTheme } from '@nextui-org/react';

import type { Skill } from '../../../_content/Skills';
import Li from '../Li';

function Skill({ name, descriptions }: Skill) {
  const { theme } = useTheme();
  return (
    <Div>
      <h4>{name}</h4>
      <ul>
        {descriptions.map((description, index) => (
          <Li key={index} theme={theme}>
            {description}
          </Li>
        ))}
      </ul>
    </Div>
  );
}

export default Skill;

const Div = styled.div`
  margin-bottom: 2rem;
`;
