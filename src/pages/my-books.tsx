import { useSession } from "next-auth/react";
import Layout from "../components/Layout";
import MyBooksList from "../components/MyBooksList";
import { Loading } from "../components/ui/Loading";

const MyBooks = () => {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[200px]">
          <Loading />
        </div>
      </Layout>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-[200px]">
          <h2 className="text-2xl font-semibold text-slate-200 mb-4">
            Your Books
          </h2>
          <p className="text-slate-400">Please sign in to view your books.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <MyBooksList />
    </Layout>
  );
};

export default MyBooks;
