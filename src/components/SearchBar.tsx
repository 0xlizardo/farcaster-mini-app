import React, { useState, ChangeEvent } from "react";
import styled from "styled-components";

const SearchContainer = styled.form`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  border-radius: 50px;
  padding: 4px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 20px;
  font-size: 16px;
  background: transparent;
  color: #2c3e50;
  border-radius: 50px;
  transition: all 0.3s ease;

  &::placeholder {
    color: #95a5a6;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(145deg, #4CAF50, #45a049);
  border: none;
  border-radius: 50px;
  padding: 12px 25px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(145deg, #45a049, #3d8b40);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  }
`;

const SearchIcon = styled.span`
  margin-right: 4px;
`;

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
    <SearchContainer onSubmit={handleSubmit}>
      <SearchWrapper>
        <SearchInput
          type="text"
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
        <SearchButton type="submit">
          <SearchIcon>🔍</SearchIcon>
          Search
        </SearchButton>
      </SearchWrapper>
    </SearchContainer>
  );
};

export default SearchBar; 