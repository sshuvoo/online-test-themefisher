"use server";

interface Props {
  limit: number;
  page: number;
}

export interface Repo {
  id: number;
  forks_count: number;
  git_url: number;
  html_url: number;
  language: string;
  name: string;
  description: string;
  stargazers_count: number;
}

export const getPublicRepos = async ({ limit, page }: Props) => {
  const res = await fetch(
    `https://api.github.com/orgs/themefisher/repos?per_page=${limit}&page=${page}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.API_KEY}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Error to fetch public repos!");
  }

  const json: Repo[] = await res.json();
  return json;
};
