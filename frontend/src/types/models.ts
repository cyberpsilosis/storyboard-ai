interface Script {
  content: string;
  screenplay?: string;
}

interface Shot {
  id: string;
  description: string;
  angle: string;
  movement: string;
  image?: string;
}

interface Project {
  id: string;
  title: string;
  script: Script;
  shotlist: Shot[];
  storyboard: string[];
} 