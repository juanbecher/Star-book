import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";
import TextField from '@mui/material/TextField';
import React, { useState } from "react";
import axios from 'axios'
import Rating from '@mui/material/Rating';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useSession } from "next-auth/react";



interface Book {
  id: string,
  volumeInfo: {
    
    title: string,
    subtitle:string,
    description: string,
    categories: string[],
    pageCount: number,
    imageLinks: {
      thumbnail: string
    },
    authors: string[],
    publisher: string,
    publishedDate: string,
    averageRating: number,
    ratingsCount: number
  }
  
}
interface User {
  name: string,
  mybooks: {
    [key: string]: string
  }
}

const Home: React.FC<{initial_books: Book[]}> = ({initial_books}) => {
  const [books, setBooks] = useState(initial_books)
  const [isSearching, setIsSearching] = useState(false)
  const [user_test, setUser] = useState<User>({
    "name": "Juan",
    "mybooks": {
      "HPJbRQAACAAJ": "wantToRead",
      "Yz8Fnw0PlEQC": "wantToRead",
      "MAvEygEACAAJ": "reading",
      "0DqIbtgHPFkC": "read",
    }
  })
  const {data: session} = useSession()
  console.log(user_test)
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

  const handleBookState = (e: SelectChangeEvent) => {
    // setAge(event.target.value);
    console.log(e.target.value)
    setUser({...user_test,
      mybooks : {
        ...user_test.mybooks,
        [e.target.name] : e.target.value
      }
    })

  };
  const inputStyle = { WebkitBoxShadow: "0 0 0 1000px #191919 inset",  };
  return (
    <>
      <Layout>
      <div className="h-10"></div>
      {/* <h1 className="text-5xl md:text-[3rem] leading-normal font-extrabold text-gray-600 text-center">
          Search your favourite book!
      </h1> */}
      
      <div className="h-10"></div>
      <div className="w-80 flex justify-center mx-auto" >
      <TextField fullWidth id="outlined-basic" label="Search book" variant="outlined" inputProps={{ style: inputStyle }} onChange={handleSearch} />
      </div>
      <div className="h-10"></div>
      <div className="grid gap-6 grid-cols-2  ">
        {isSearching ? <div>Searching</div> : <>
        {books.sort((a: Book,b: Book) => b.volumeInfo.averageRating - a.volumeInfo.averageRating).map((book : Book,index: number) => 
          
          <div key={index}>
          {(book.volumeInfo) ?
            <Card  sx={{  height: 200, display:"flex"}}>
            <CardMedia
              component="img"
              image={book.volumeInfo.imageLinks? book.volumeInfo.imageLinks.thumbnail: "/imagen.png"} 
              alt="Img description"
              className="w-1/4 p-4 rounded-lg"
              // sx={{width: 25}}
            />
            <div className="w-3/4 flex flex-col">
            <CardContent className="px-2 pt-2 pb-0">
              <Typography gutterBottom variant="h6" component="div"  className="m-0">
               {book.volumeInfo.title}
              </Typography>
              
              {/* Author */}
              <p className="text-slate-400">by {book.volumeInfo.authors ? book.volumeInfo.authors[0] : ""}</p>

              {/* Publiser - publish date - pages*/}
              <div className="flex  mt-1 text-slate-300 text-xs">
                {book.volumeInfo.publisher && <p>{book.volumeInfo.publisher}</p>}
                {book.volumeInfo.publishedDate && <p className="mx-1"> on {book.volumeInfo.publishedDate}</p> }
                {book.volumeInfo.pageCount && <p  className="mx-1">, {book.volumeInfo.pageCount} pages</p>}
                
              </div>
              

              {/* Rating */}
               <div className="flex items-center my-1 text-xs text-slate-400">
                <Rating name="size-small" value={book.volumeInfo.averageRating} size="small" precision={0.5}/>
                {book.volumeInfo.averageRating && <p className="px-5">{book.volumeInfo.averageRating} avg rate</p>}
                {book.volumeInfo.ratingsCount && <p className="px-5">{book.volumeInfo.ratingsCount} votes</p>}
              </div>

              {/* <Typography variant="body2" color="text.secondary" className="overflow-hidden h-12">
                {book.volumeInfo.description}
            </Typography> */}
              
              
            </CardContent>
            <CardActions className=" mt-auto mb-1 px-1 py-0">
              {/* <Button size="small">Share</Button> */}
              <FormControl  sx={{ m: 1, minWidth: 120 }} size="small">
        {/* <InputLabel id="demo-simple-select-filled-label">status</InputLabel> */}
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          name={book.id}
          value={user_test.mybooks[book.id] || "wantToRead"}
          // value="wantToRead"
          onChange={handleBookState}
        >
          {/* <MenuItem value={"wantToRead"}>
            <em>Select status</em>
          </MenuItem> */}
          <MenuItem value={"wantToRead"}>Want to read</MenuItem>
          <MenuItem value={"reading"}>Reading</MenuItem>
          <MenuItem value={"read"}>Read</MenuItem>
        </Select>
      </FormControl>
            </CardActions>
            </div>
          </Card>
          :
          <CircularProgress />
        }
          </div>
          
          )}
        
        </>}
        
      </div>
      
      </Layout>
     
    </>
  );
};


export default Home;

export async function getStaticProps() {
  const res = await axios(`https://www.googleapis.com/books/v1/volumes?q=harry potter&maxResults=20&printType=books&key${process.env.GOOGLE_API_KEY}`, {headers: {
      'content-type': 'application/json; charset=UTF-8'
    }})

  const initial_books = res.data.items
  return {
    props: {
      initial_books,
    },
  }
}

{/* <div>
          {(book.volumeInfo) ?
            <Card sx={{ maxWidth: 345, maxHeight: 500}}>
            <CardMedia
              component="img"
              height="128"
              image={book.volumeInfo.imageLinks? book.volumeInfo.imageLinks.thumbnail: "/imagen.png"} 
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
              {book.volumeInfo.title}
              </Typography>
              <p className="text-slate-400">by {book.volumeInfo.authors ? book.volumeInfo.authors[0] : ""}</p>
              <Typography variant="body2" color="text.secondary">
              <div  className="overflow-hidden">
              {book.volumeInfo.description}
              </div>
              
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
          :
          <CircularProgress />
        }
          </div> */}




           // Card
          // <div key={index} className="border border-gray-600 p-3">
          //   {/* Image */}
          //   <div className="flex justify-center">
          //     {book.volumeInfo.imageLinks && <Image className="object-fill object-center" src={book.volumeInfo.imageLinks.thumbnail} width={128} height={128}/>}
              
          //   </div>
          //   {/* Title and Author */}
          //   <div>
          //   <h3 className="text-xl">{book.volumeInfo.title}</h3>
          //   <p>by {book.volumeInfo.authors}</p>
          //   </div>
            
          //   {/* Rating */}
          //   <div className="flex justify-between text-xs text-slate-400">
          //   <Rating name="size-small" defaultValue={book.volumeInfo.averageRating} size="small" precision={0.5}/>
          //   <p>{book.volumeInfo.averageRating} avg rate</p>
          //   <p>{book.volumeInfo.ratingsCount} votes</p>
          //   </div>
            

          //   <p>{book.volumeInfo.publishedDate}</p>
          // </div>