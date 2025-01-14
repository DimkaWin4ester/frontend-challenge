import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../store/store';
import { fetchCatsLiked, fetchCats } from '../store/cats/catsSlice';
import Header from '../components/header/Header';
import Card from '../components/card/Card';
import style from './App.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [renderedCats, setRenderedCats] = useState<'allCats' | 'likedCats'>('allCats');

  const { cats, error } = useSelector(
    (state: RootState) => state.cats
  );

  const handleAllCats = () => {
    setRenderedCats('allCats');
    dispatch(fetchCats());
  }

  const handleLikedCats = () => {
    setRenderedCats('likedCats');
    dispatch(fetchCatsLiked());
  }

  useEffect(() => {
    dispatch(fetchCats());
    if (document.documentElement.scrollHeight <= window.innerHeight) dispatch(fetchCats());
  }, [dispatch]);

  return (
    <>
      <Header handleAllCats={handleAllCats} handleLikedCats={handleLikedCats} renderedCats={renderedCats}/>

      <main className={style.main}>
        <InfiniteScroll 
          className={style.scroll}
          dataLength={cats.length}
          next={() => dispatch(fetchCats())}
          hasMore={true}
          loader={<p>... загружаем котиков ...</p>}
        >
          {cats.map((cat) => (
            <Card key={cat.id} cat={cat} />
          ))}
        </InfiniteScroll>
      </main>
      {error && <p>{error}</p>}
    </>
  );
}
