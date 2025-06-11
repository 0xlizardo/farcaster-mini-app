import React, { useState, ChangeEvent } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search for food..."
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto">
      <div className="relative flex items-center bg-gradient-to-br from-white to-gray-100 rounded-full p-1 shadow-lg border border-gray-200 transition-all duration-300">
        <input
          type="text"
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 border-none outline-none py-3 px-5 text-base bg-transparent text-gray-800 rounded-full transition-all duration-300 placeholder-gray-400 focus:ring-2 focus:ring-green-200"
        />
        <button
          type="submit"
          className="bg-gradient-to-br from-green-500 to-green-600 border-none rounded-full py-3 px-6 text-white text-base cursor-pointer transition-all duration-300 flex items-center gap-2 shadow-md hover:from-green-600 hover:to-green-700 hover:-translate-y-px hover:shadow-lg active:translate-y-0 active:shadow-md"
        >
          <span className="mr-1">🔍</span>
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar; 