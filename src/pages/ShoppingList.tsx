import React from "react";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const ShoppingList: React.FC = () => {
  const [item, setItem] = useState("");
  const utils = trpc.useContext();
  // const { data: sessionData } = useSession();

  const { mutate } = trpc.shoppingList.addItem.useMutation({
    onSuccess: () => {
      utils.shoppingList.getAll.invalidate();
      setItem("");
    },
  });

  const { data: items } = trpc.shoppingList.getAll.useQuery();

  return (
    <>
      <div className="w-full space-y-4">
        <form
          className="block w-full"
          onSubmit={(e) => {
            e.preventDefault();
            mutate({
              text: item,
            });
          }}
        >
          {/* <div className="flex">
            <input
              type="text"
              id="email"
              className="block w-full min-w-0 flex-1 rounded-none rounded-r-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Add item..."
              value={item}
              onChange={(e) => setItem(e.currentTarget.value)}
              required
            />
            <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
              @
            </span>
          </div> */}
          <div className="flex">
            <input
              type="text"
              className="block w-full min-w-0 flex-1 rounded-none rounded-l-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Add item..."
              value={item}
              onChange={(e) => setItem(e.currentTarget.value)}
              required
            />
            <button
              type="submit"
              className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </form>
        {items?.map((i) => (
          <div className="w-full" key={i.id}>
            <input
              type="email"
              id="email"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Add item..."
              value={i.item}
              required
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ShoppingList;
