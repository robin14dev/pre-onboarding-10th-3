import { useEffect, useState } from "react";
import { getRecommendTodoList } from "../api/search";
import styled from "styled-components";

type DropdownProps = {
  text: string;
};

const StyledUl = styled.ul`
  /* display: flex;
  flex-direction: column;
  align-items: flex-start; */
  padding: 9px 5px;
  overflow-y: scroll;

  /* position: absolute; */
  width: 364px;
  height: 164px;
  left: 587px;
  top: 399px;

  background: #ffffff;

  border: 1px solid #dedede;

  box-shadow: 0px 0px 1px rgba(50, 50, 50, 0.05),
    0px 2px 4px rgba(50, 50, 50, 0.1);
  border-radius: 5px;
`;

const StyledLi = styled.li`
  display: block;
  padding: 6px 12px;
  gap: 10px;
  width: 354px;
  height: 28px;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  background: #ffffff;
  border-radius: 3px;

  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;

  mark {
    color: #2bc9ba;
    background: transparent;
  }

  &:hover {
    background: #f2f2f2;
    border-radius: 3px;
  }

  &:active {
    background-color: #d5f4f1;
  }
`;

const highlightText = (title: string, searchText: string) => {
  if (
    searchText !== "" &&
    title.toLowerCase().includes(searchText.toLowerCase())
  ) {
    let splitedArr = title.split(new RegExp(`(${searchText})`, "gi"));
    console.log(splitedArr);

    return (
      <>
        {splitedArr.map((ele, idx) =>
          ele.toLowerCase() === searchText.toLowerCase() ? (
            <mark key={idx}>{ele}</mark>
          ) : (
            ele
          )
        )}
      </>
    );
  }

  return title;
};

const Dropdown = ({ text }: DropdownProps) => {
  const [items, setItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const getItems = async (text: string, page: number) => {
      const recommendRes = await getRecommendTodoList(text, page);
      setItems(recommendRes.data.result);
    };
    getItems(text, page);
  }, [text]);

  if (items.length === 0) return null;

  return (
    <StyledUl>
      {items.length > 0 &&
        items.map((item) => (
          <StyledLi key={item}>{highlightText(item, text)}</StyledLi>
        ))}
    </StyledUl>
  );
};

export default Dropdown;
