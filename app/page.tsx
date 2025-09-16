import { getPublicRepos } from "@/actions/get-public-repo";
import { RepoTable } from "@/components/repo-table";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page: string | undefined }>;
}) {
  const { page } = await searchParams;
  const repos = await getPublicRepos({ page: Number(page) || 1, limit: 10 });

  return (
    <main>
      <div className="max-w-6xl mx-auto py-8 lg:py-16 px-2 sm:px-4 md:px-8 lg:px-16 xl:px-20">
        <RepoTable repos={repos} page={Number(page) || 1} />
      </div>
    </main>
  );
}
