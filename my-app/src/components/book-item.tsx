'use client'

import Context from "@/utils/context"
import { useContext, useState } from "react"

export function BookItem(props: { count: Function }) {
  const [number, setNumber] = useState(0)
  const counter = useContext(Context)
  console.log(counter)
  const buyBook = () => { /* var a = props.count(counter + 1);  */setNumber(number + 1); console.log('a', number) }

  return <div className='flex flex-1 flex-wrap flex-col mx-2 w-60 items-center'>
    <div>Куплено этой книги - {number}</div>
    <button className="text-sm text-blue-400" onClick={() => buyBook()}>Купить книгу</button>
  </div>
}