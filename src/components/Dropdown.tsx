import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { createTodo } from "../api/todo";

type DropdownProps = {
  // pageRef: React.MutableRefObject<number>;
  isLast: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  text: string;
  items: string[];
  setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
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
  cursor: pointer;

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
    // console.log(splitedArr);

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

const Dropdown = ({
  isLast,
  setPage,
  text,
  items,
  setTodos,
  setInputText,
}: DropdownProps) => {
  // const [items, setItems] = useState<string[]>([]);
  // const [isLast, setIsLast] = useState(false);
  const observerTargetEl = useRef<HTMLDivElement>(null);
  // const [prevText, setPrevText] = useState(text);

  // if (prevText !== text) {
  //   setIsLast(false);
  // }
  /*
  qty가 10미만이면 마지막 페이지
  마지막이면 더이상 요청 안함
  매 응답시 qty가 데이터로 받아와짐

  ...이 시야에 보이면 마지막인지 아닌지 판단하기


  마지막이면 ... 없애기

  받아온 응답의 qty가 10미만인지 판단하기
    10미만이면 마지막 페이지 이므로 요청 중단
    isLast = true

    10이면 page++, ...표시보이도록 하기

    스크롤 내려서 ...이 보이면 observer

-------
    isLast ? 더이상없슴 : '...'



    observer로 받아와야 되는디

    Dropdown 마운트 => api호출 전이니깐 return null
    => useEffect로 api 호출 후, ref 관찰하려는데 ref가 없어서 못함 리스트, 
    => 

    Dropdown 마운트 => 렌더링 직전에 데이터를 다 받아온다 => 

  

  */

  const handleClick = async (title: string) => {
    console.log(title);

    try {
      const newItem = { title };
      const { data } = await createTodo(newItem);

      if (data) {
        return setTodos((prev) => [...prev, data]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setInputText("");
    }
  };

  useEffect(() => {
    if (isLast) return;
    // if (!observerTargetEl.current || isLast) return;
    const callback: IntersectionObserverCallback = (entries, observer) => {
      console.log("here");

      if (entries[0].isIntersecting) {
        console.log("isInterSecting!!");

        setPage((prev) => prev + 1);
      }
    };
    const io = new IntersectionObserver(callback);

    if (observerTargetEl.current) {
      // console.log("111");

      io.observe(observerTargetEl.current);
    }

    return () => {
      console.log("clean up");

      io.disconnect();
    };
  }, [setPage, isLast]);

  return (
    <StyledUl>
      {items.map((item) => (
        <StyledLi key={item + text} onClick={() => handleClick(item)}>
          {highlightText(item, text)}
        </StyledLi>
      ))}
      <div ref={observerTargetEl}>{isLast ? "더이상 없슴" : "..."}</div>
    </StyledUl>
  );
};

export default Dropdown;
