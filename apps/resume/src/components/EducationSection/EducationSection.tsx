import { Educations } from '../../../_content/Education';
import Section from '../Section';
import Education from './Education';

function EducationSection({ title, list }: Educations) {
  return (
    <Section>
      <h2>{title}</h2>

      {list?.map((experience, index) => (
        <Education key={index} {...experience} />
      ))}
    </Section>
  );
}

export default EducationSection;
