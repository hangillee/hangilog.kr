import { data as educationData, Educations } from '../../_content/Education';
import { data as headerData, Header as HeaderType } from '../../_content/Header';
import { data as otherExperienceDate, OtherExperience } from '../../_content/Other-Experience';
import { data as skillsData, Skills } from '../../_content/Skills';
import { data as workExperienceData, WorkExperience } from '../../_content/Work-Experience';
import EducationSection from '../components/EducationSection';
import Header from '../components/Header';
import OtherExperienceSection from '../components/OtherExperienceSection';
import SkillsSection from '../components/SkillsSection/SkillsSection';
import WorkExperienceSection from '../components/WorkExperienceSection';

interface Props {
  header: HeaderType;
  workExperience: WorkExperience;
  otherExperience: OtherExperience;
  education: Educations;
  skills: Skills;
}

function Resume({ header, workExperience, otherExperience, education, skills }: Props) {
  return (
    <main>
      <Header {...header} />
      <WorkExperienceSection {...workExperience} />
      <OtherExperienceSection {...otherExperience} />
      <EducationSection {...education} />
      <SkillsSection {...skills} />
    </main>
  );
}

export default Resume;

export async function getStaticProps() {
  return {
    props: {
      header: headerData,
      workExperience: workExperienceData,
      otherExperience: otherExperienceDate,
      education: educationData,
      skills: skillsData,
    },
  };
}
