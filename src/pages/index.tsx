import type { NextPage } from "next";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";
import TextField from '@mui/material/TextField';
import React, { useState } from "react";
import axios from 'axios'
import Image from "next/image";


interface Book {
  volumeInfo: {
    title: string,
    imageLinks: {
      thumbnail: string
    },
    authors: string[],
    publishedDate: string,
    averageRating: number
  }
  
} 

const Home: NextPage = () => {
  const [books, setBooks] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  // const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true)
    const value = e.currentTarget.value
    const res = await axios(`https://www.googleapis.com/books/v1/volumes?q=${value}&maxResults=20&printType=books&key${process.env.GOOGLE_API_KEY}`, {headers: {
      'content-type': 'application/json; charset=UTF-8'
    }})
    setBooks(res.data.items)
    console.log(res.data)
    setIsSearching(false)
  }

  return (
    <>
      <Layout>
      <div className="h-10"></div>
      <h1 className="text-5xl md:text-[3rem] leading-normal font-extrabold text-gray-600 text-center">
          Search your favourite book!
      </h1>
      <div className="h-10"></div>
      <div className="w-50 flex justify-center" >
      <TextField fullWidth id="outlined-basic" label="Search book" variant="outlined" onChange={handleSearch} />
      </div>
      <div className="h-10"></div>
      <div className="grid gap-6 grid-cols-5  ">
        {isSearching ? <div>Searching</div> : <>
        {books.sort((a: Book,b: Book) => b.volumeInfo.averageRating - a.volumeInfo.averageRating).map((book : Book,index: number) => 
          <div key={index} className="border-2 border-gray-600">
            <div className="flex justify-center">
              {book.volumeInfo.imageLinks && <Image className="object-fill object-center" src={book.volumeInfo.imageLinks.thumbnail} width={128} height={128}/>}
              
            </div>
            <h3>{book.volumeInfo.title}</h3>
            <p>{book.volumeInfo.authors}</p>
            <p>{book.volumeInfo.publishedDate}</p>
          </div>
          
          )}
        
        </>}
        
      </div>
      
      </Layout>
     
    </>
  );
};


export default Home;
