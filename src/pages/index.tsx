import type { NextPage } from "next";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";
import TextField from '@mui/material/TextField';

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const Home: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Layout>
      <div className="h-10"></div>
      <h1 className="text-5xl md:text-[3rem] leading-normal font-extrabold text-gray-400 text-center">
          Search your favourite book!
      </h1>
      <div className="h-10"></div>
      <div className="w-50 flex m-auto text-gray-400" >
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      </div>
      
      </Layout>
     
    </>
  );
};


export default Home;
