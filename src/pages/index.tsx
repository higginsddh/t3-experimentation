import { Container } from "@mantine/core";
import { type NextPage } from "next";
import ShoppingList from "../components/ShoppingList/ShoppingList";

const Home: NextPage = () => {
  return (
    <>
      <Container>
        <ShoppingList />
      </Container>
    </>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-2">
//       {sessionData && (
//         <p className="text-2xl text-blue-500">
//           Logged in as {sessionData?.user?.name}
//         </p>
//       )}
//       {secretMessage && (
//         <p className="text-2xl text-blue-500">{secretMessage}</p>
//       )}
//       <button
//         className="bg-violet-50 hover:bg-violet-100 rounded-md border border-black px-4 py-2 text-xl shadow-lg"
//         onClick={sessionData ? () => signOut() : () => signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };

// const MutateTest: React.FC = () => {
//   const utils = trpc.useContext();
//   const { data: sessionData } = useSession();

//   const { mutate } = trpc.example.testMutate.useMutation({
//     onSuccess: () => {
//       utils.example.testGet.invalidate();
//     },
//   });

//   const { data: count } = trpc.example.testGet.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-2">
//       <button
//         className="bg-violet-50 hover:bg-violet-100 rounded-md border border-black px-4 py-2 text-xl shadow-lg"
//         onClick={() => {
//           // temp
//           mutate();
//         }}
//       >
//         Test Mutate - {count}
//       </button>
//     </div>
//   );
// };

// type TechnologyCardProps = {
//   name: string;
//   description: string;
//   documentation: string;
// };

// const TechnologyCard: React.FC<TechnologyCardProps> = ({
//   name,
//   description,
//   documentation,
// }) => {
//   return (
//     <section className="flex flex-col justify-center rounded border-2 border-gray-500 p-6 shadow-xl duration-500 motion-safe:hover:scale-105">
//       <h2 className="text-lg text-gray-700">{name}</h2>
//       <p className="text-sm text-gray-600">{description}</p>
//       <Link
//         className="text-violet-500 m-auto mt-3 w-fit text-sm underline decoration-dotted underline-offset-2"
//         href={documentation}
//         target="_blank"
//         rel="noreferrer"
//       >
//         Documentation
//       </Link>
//     </section>
//   );
// };
