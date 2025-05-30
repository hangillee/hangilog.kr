import data from './data.json';

export interface Experience {
  title: {
    text: string;
    githubLink: string | null;
    otherLink: string | null;
  };
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  which: Array<{
    main: string;
    sub?: string[];
  }>;
}

export interface OtherExperience {
  title: string;
  list: Experience[];
}

export { data };
