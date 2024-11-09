import data from './data.json';

export interface Academy {
  title: {
    text: string;
    githubLink: string | null;
    otherLink: string | null;
  };
  major: string;
  startDate: string;
  endDate: string;
  which: Array<{
    main: string;
    sub?: string[];
  }>;
}

export interface Educations {
  title: string;
  list: Academy[];
}

export { data };
