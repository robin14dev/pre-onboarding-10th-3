import { FaPlusCircle, FaSpinner } from "react-icons/fa";
import { useCallback, useEffect, useState, useRef } from "react";
import { getRecommendTodoList } from "../api/search";

import { createTodo } from "../api/todo";
import useFocus from "../hooks/useFocus";
import Dropdown from "./Dropdown";
import useDebounce from "../hooks/useDebounce";

type InputTodoProps = {
  setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>;
};

const InputTodo = ({ setTodos }: InputTodoProps) => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isLast, setIsLast] = useState(false);
  const debouncedText = useDebounce(inputText, 500);
  const [prevText, setPrevText] = useState(debouncedText);

  const getItems = async (text: string, offset: number) => {
    console.log("getItems", text, offset);

    try {
      const recommendRes = await getRecommendTodoList(text, offset);

      const nextItems = recommendRes.data.result;

      setItems(nextItems);

      if (recommendRes.data.qty < 10) {
        setIsLast(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getMoreData = async (text: string, offset: number) => {
    const recommendRes = await getRecommendTodoList(text, offset);

    const nextItems = recommendRes.data.result;

    setItems((prev) => [...prev, ...nextItems]);
    if (recommendRes.data.qty < 10) {
      setIsLast(true);
    }
  };

  useEffect(() => {
    console.log("prev : ", prevText, "D :", debouncedText, isLast);

    if (!debouncedText) {
      return setItems([]);
    }

    if (prevText !== debouncedText) {
      setIsLast(false);
      setPrevText(debouncedText);
      if (isLast) return;
      getItems(debouncedText, 1);
    } else {
      if (isLast) return;
      getMoreData(debouncedText, page);
    }
  }, [debouncedText, page]);

  /*

  맨 처음, page : 1, inputText, dT = '', items = [], isLast = false

  키워드 입력시
  1. 아이템을 받아온다 getItems(dT, 1)
  2. 받아온 배열을 대체한다
  3. recommendRes.data.qty < 10 인지 확인한다
      - 10 이하면 isLast이므로 상태변화 시킨다. 

  키워드 변경시
  1. //// 기존의 조건을 리셋한다 : page = 1, items = [], isLast = false
  2. 아이템을 받아온다 getItems(dT, 1)
  3. 받아온 배열을 대체한다.
  4. recommendRes.data.qty < 10 인지 확인한다
      - 10 이하면 isLast이므로 상태변화 시킨다. 

  옵저버로 ref 발견해서 page++되었을 때
  1. 마지막인지 확인해서 마지막이면 return
  2. 아이템을 받아온다 getItems(dT, 2)
  3. 받아온 아이템을 기존 배열에 합친다

  
  
  */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();
        setIsLoading(true);
        const trimmed = inputText.trim();
        if (!trimmed) {
          return alert("Please write something");
        }
        const newItem = { title: trimmed };
        const { data } = await createTodo(newItem);
        if (data) {
          return setTodos((prev) => [...prev, data]);
        }
      } catch (error) {
        console.error(error);
        alert("Something went wrong.");
      } finally {
        setInputText("");
        setIsLoading(false);
      }
    },
    [inputText, setTodos]
  );

  return (
    <>
      <form className="form-container" onSubmit={handleSubmit}>
        <input
          className="input-text"
          placeholder="Add new todo..."
          autoFocus={true}
          // ref={ref}
          value={inputText}
          onChange={handleChange}
          disabled={isLoading}
        />
        {!isLoading ? (
          <button className="input-submit" type="submit">
            <FaPlusCircle className="btn-plus" />
          </button>
        ) : (
          <FaSpinner className="spinner" />
        )}
      </form>
      {items.length ? (
        <Dropdown
          text={debouncedText}
          items={items}
          setInputText={setInputText}
          setTodos={setTodos}
          // pageRef={pageRef}
          setPage={setPage}
          isLast={isLast}
        />
      ) : null}
    </>
  );
};

export default InputTodo;
