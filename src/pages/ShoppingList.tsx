import React from "react";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsUpDown,
  faPlus,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const ShoppingList: React.FC = () => {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("1");
  const utils = trpc.useContext();
  // const { data: sessionData } = useSession();

  const { mutate: addItem, isLoading: isAddingItem } =
    trpc.shoppingList.addItem.useMutation({
      onSuccess: () => {
        utils.shoppingList.getAll.invalidate();
        setItem("");
        setQuantity(1);
      },
    });

  const { data: items, isLoading: isLoadingItems } =
    trpc.shoppingList.getAll.useQuery();

  return (
    <>
      {isLoadingItems ? <Spinner /> : null}
      <div className="w-full space-y-4">
        <form
          className="block w-full"
          onSubmit={(e) => {
            e.preventDefault();
            addItem({
              text: item,
              quantity: parseInt(quantity),
            });
          }}
        >
          <div className="flex">
            <input
              type="text"
              className="block flex-1 rounded border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Add item..."
              value={item}
              onChange={(e) => setItem(e.currentTarget.value)}
              required
              aria-label="Shopping list item"
            />
            <input
              type="number"
              className="ml-5 w-14 rounded border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              value={quantity}
              onChange={(e) => setQuantity(e.currentTarget.value)}
              required
              max={99}
              aria-label="Shopping list quantity"
            />
            <button
              type="submit"
              className="ml-5 inline-flex items-center rounded border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400"
              disabled={isAddingItem}
            >
              {isAddingItem ? (
                <FontAwesomeIcon icon={faSpinner} spin className="w-2" />
              ) : (
                <FontAwesomeIcon icon={faPlus} className="w-2" />
              )}
            </button>
          </div>
        </form>
        {items?.map((i) => (
          <div className="flex w-full" key={i.id}>
            <input
              type="text"
              className="block flex-1 rounded border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Add item..."
              value={i.item}
              required
            />
            <input
              type="number"
              className="ml-5 w-14 rounded border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              value={i.quantity.toString()}
              required
            />
            <button
              type="submit"
              className="ml-5 inline-flex items-center rounded border border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400"
              disabled
            >
              <FontAwesomeIcon icon={faArrowsUpDown} className="w-2" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ShoppingList;

function Spinner() {
  return (
    <>
      <div className="fixed top-0 left-0 z-50 block flex h-full h-screen w-full bg-white opacity-75">
        <div className="m-auto text-center">
          <div role="status">
            <svg
              className="mr-2 inline h-20 w-20 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </>
  );
}
