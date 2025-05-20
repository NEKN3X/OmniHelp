interface Help {
  open: string;
  command: string;
  expanded: string[];
  page?: string;
}
interface NormalHelp extends Help {
  page: undefined;
}
interface ScrapboxHelp extends Help {
  page: string;
}

type Glossary = Map<string, string>;
