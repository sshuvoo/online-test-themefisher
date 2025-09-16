"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./ui/input";
import Form from "next/form";

import { Repo } from "@/actions/get-public-repo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { Button } from "./ui/button";

type Sort = "Star-A" | "Star-D" | "Fork-A" | "Fork-D" | "A-Z" | "Z-A" | null;

export function RepoTable({ repos, page }: { repos: Repo[]; page: number }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<Sort>(null);

  const languages = useMemo(() => {
    return [...new Set<string>(repos.map((repo) => repo.language))];
  }, [repos]);

  const filteredRepos = useMemo(() => {
    let values = repos;

    if (query.trim()) {
      values = values.filter((v) =>
        v.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filter && filter != "all") {
      values = values.filter((v) => v.language == filter);
    }

    if (!sort) return values;

    if (sort == "Fork-A") {
      values = values.sort((a, b) => a.forks_count - b.forks_count);
    } else if (sort == "Fork-D") {
      values = values.sort((a, b) => b.forks_count - a.forks_count);
    } else if (sort == "Star-A") {
      values = values.sort((a, b) => a.stargazers_count - b.stargazers_count);
    } else if (sort == "Star-D") {
      values = values.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (sort == "A-Z") {
      values = values.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort == "Z-A") {
      values = values.sort((a, b) => b.name.localeCompare(a.name));
    }

    return values;
  }, [repos, query, filter, sort]);

  return (
    <div>
      <div className="grid grid-cols-[1fr_auto] mb-10 items-center gap-2 md:gap-6">
        <div>
          <Input
            placeholder="Search by names"
            value={query}
            onChange={(ev) => {
              setQuery(ev.target.value);
            }}
          />
        </div>
        <div>
          <Select
            onValueChange={(value) => {
              setFilter(value);
            }}
          >
            <SelectTrigger className="lg:w-[300px] w-[200px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="capitalize" value="all">
                All languages
              </SelectItem>
              {languages.map((lang) => (
                <SelectItem className="capitalize" key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableCaption>A list of Public Repositories.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <button
                className="flex items-center gap-2"
                onClick={() => {
                  setSort((prev) => {
                    if (prev == null) return "A-Z";
                    return prev == "A-Z" ? "Z-A" : "A-Z";
                  });
                }}
              >
                Name <ArrowDownUp size={14} />
              </button>
            </TableHead>
            <TableHead className="truncate lg:max-w-[300px] max-w-[200px]">
              Description
            </TableHead>
            <TableHead>Language</TableHead>
            <TableHead>
              <button
                className="flex items-center gap-2"
                onClick={() => {
                  setSort((prev) => {
                    if (prev == null) return "Star-A";
                    return prev == "Star-A" ? "Star-D" : "Star-A";
                  });
                }}
              >
                Stars <ArrowDownUp size={14} />
              </button>
            </TableHead>
            <TableHead className="text-right">
              <button
                className="flex items-center gap-2"
                onClick={() => {
                  setSort((prev) => {
                    if (prev == null) return "Fork-A";
                    return prev == "Fork-A" ? "Fork-D" : "Fork-A";
                  });
                }}
              >
                Forks <ArrowDownUp size={14} />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRepos.map((repo) => (
            <TableRow key={repo.id}>
              <TableCell className="font-medium">{repo.name}</TableCell>
              <TableCell className="truncate max-w-[250px]">
                {repo.description}
              </TableCell>
              <TableCell className="text-start">{repo.language}</TableCell>
              <TableCell className="text-start">
                {repo.stargazers_count}
              </TableCell>
              <TableCell className="text-right">{repo.forks_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end mt-4 gap-2 items-center">
        <Form action="/">
          <input defaultValue={Math.max(1, page - 1)} hidden name="page" />
          <Button type="submit" variant="outline">
            Prev
          </Button>
        </Form>
        <p>Page: {page}</p>
        <Form action="/">
          <input defaultValue={page + 1} hidden name="page" />
          <Button type="submit" variant="outline">
            Next
          </Button>
        </Form>
      </div>
    </div>
  );
}
